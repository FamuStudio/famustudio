using UnityEngine;

namespace UrbanRun
{
    [RequireComponent(typeof(CharacterController))]
    public sealed class PlayerController : MonoBehaviour
    {
        public const float LaneWidth = 2.2f;
        [SerializeField] private float laneLerp = 14f;
        [SerializeField] private float jumpVelocity = 8.5f;
        [SerializeField] private float gravity = 22f;
        [SerializeField] private float slideDuration = 0.72f;
        [SerializeField] private float swipeThreshold = 55f;

        private CharacterController character;
        private int lane = 1;
        private float verticalVelocity;
        private float slideRemaining;
        private float standingHeight;
        private Vector3 standingCenter;
        private Vector2 pointerStart;
        private bool pointerHeld;
        private float lastTapTime = -1f;
        private const float DoubleTapWindow = 0.32f;

        public int Lane => lane;
        public bool IsSliding => slideRemaining > 0f;
        public bool IsGrounded => character != null && character.isGrounded;

        private void Awake()
        {
            character = GetComponent<CharacterController>();
            standingHeight = character.height;
            standingCenter = character.center;
        }

        private void Update()
        {
            if (GameManager.Instance == null || GameManager.Instance.State != GameState.Running) return;
            ReadKeyboard();
            ReadPointer();
            UpdateMotion();
        }

        private void ReadKeyboard()
        {
            if (Input.GetKeyDown(KeyCode.LeftArrow) || Input.GetKeyDown(KeyCode.A)) MoveLane(-1);
            if (Input.GetKeyDown(KeyCode.RightArrow) || Input.GetKeyDown(KeyCode.D)) MoveLane(1);
            if (Input.GetKeyDown(KeyCode.UpArrow) || Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.Space)) Jump();
            if (Input.GetKeyDown(KeyCode.DownArrow) || Input.GetKeyDown(KeyCode.S) || Input.GetKeyDown(KeyCode.LeftShift)) Slide();
        }

        private void ReadPointer()
        {
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    bool hudTouch = touch.position.y > Screen.height - 185f
                        || (touch.position.x > Screen.width - 200f && touch.position.y < 175f);
                    pointerStart = touch.position; pointerHeld = !hudTouch;
                }
                else if (pointerHeld && (touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled))
                {
                    HandleGesture(touch.position - pointerStart);
                    pointerHeld = false;
                }
                return;
            }
            if (Input.GetMouseButtonDown(0))
            {
                Vector2 mouse = Input.mousePosition;
                bool hudClick = mouse.y > Screen.height - 185f || (mouse.x > Screen.width - 200f && mouse.y < 175f);
                pointerStart = mouse; pointerHeld = !hudClick;
            }
            if (pointerHeld && Input.GetMouseButtonUp(0))
            {
                HandleGesture((Vector2)Input.mousePosition - pointerStart);
                pointerHeld = false;
            }
        }

        private void HandleGesture(Vector2 delta)
        {
            if (delta.magnitude >= swipeThreshold)
            {
                if (Mathf.Abs(delta.x) > Mathf.Abs(delta.y)) MoveLane(delta.x < 0 ? -1 : 1);
                else if (delta.y > 0) Jump(); else Slide();
                return;
            }
            float now = Time.unscaledTime;
            if (now - lastTapTime <= DoubleTapWindow) { GameManager.Instance?.ActivateEquipment(); lastTapTime = -1f; }
            else lastTapTime = now;
        }

        private void UpdateMotion()
        {
            if (character.isGrounded && verticalVelocity < 0f) verticalVelocity = -1.5f;
            verticalVelocity -= gravity * Time.deltaTime;
            if (slideRemaining > 0f)
            {
                slideRemaining -= Time.deltaTime;
                if (slideRemaining <= 0f) RestoreCollider();
            }
            float targetX = (lane - 1) * LaneWidth;
            float nextX = Mathf.MoveTowards(transform.position.x, targetX, laneLerp * Time.deltaTime);
            Vector3 motion = new Vector3(nextX - transform.position.x, verticalVelocity * Time.deltaTime, 0f);
            character.Move(motion);
        }

        public void MoveLane(int direction) { lane = Mathf.Clamp(lane + direction, 0, 2); }

        public void Jump()
        {
            if (character.isGrounded && !IsSliding) verticalVelocity = jumpVelocity;
        }

        public void Slide()
        {
            if (IsSliding || !character.isGrounded) return;
            slideRemaining = slideDuration;
            character.height = standingHeight * 0.52f;
            character.center = new Vector3(standingCenter.x, character.height * 0.5f, standingCenter.z);
        }

        public void ResetRunner()
        {
            lane = 1; verticalVelocity = 0f; slideRemaining = 0f;
            if (character != null) { RestoreCollider(); character.enabled = false; transform.position = Vector3.zero; character.enabled = true; }
        }

        private void RestoreCollider()
        {
            if (character == null) return;
            character.height = standingHeight;
            character.center = standingCenter;
        }
    }
}
