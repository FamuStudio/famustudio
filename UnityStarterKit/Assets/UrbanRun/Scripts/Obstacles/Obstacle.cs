using UnityEngine;

namespace UrbanRun
{
    public sealed class Obstacle : MonoBehaviour
    {
        public ObstacleKind Kind { get; private set; }
        private bool resolved;
        public void Configure(ObstacleKind kind) { Kind = kind; resolved = false; }

        private void OnTriggerEnter(Collider other)
        {
            if (GameManager.Instance == null || GameManager.Instance.State != GameState.Running) return;
            PlayerController player = other.GetComponentInParent<PlayerController>();
            if (player == null || resolved) return;
            resolved = true;
            bool avoided = (Kind == ObstacleKind.Jump && player.transform.position.y > 0.72f)
                || (Kind == ObstacleKind.Slide && player.IsSliding);
            if (avoided) GameManager.Instance.RegisterNearMiss();
            else GameManager.Instance.ApplyObstacleHit();
            WorldMover mover = GetComponent<WorldMover>();
            if (mover != null && ObjectPool.Instance != null) ObjectPool.Instance.Release(mover.PoolKey, gameObject);
        }
    }
}
