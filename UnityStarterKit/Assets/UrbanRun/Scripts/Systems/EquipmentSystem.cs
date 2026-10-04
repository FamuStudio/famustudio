using UnityEngine;

namespace UrbanRun
{
    public sealed class EquipmentSystem : MonoBehaviour
    {
        public static EquipmentSystem Instance { get; private set; }
        public EquipmentType Selected { get; private set; } = EquipmentType.Shield;
        public int Charges { get; private set; } = 1;
        public float SpeedMultiplier => Selected == EquipmentType.Nitro && activeTimer > 0f ? 1.45f : 1f;
        public bool MagnetActive => Selected == EquipmentType.Magnet && activeTimer > 0f;
        private float activeTimer;
        private PlayerController player;
        private int shieldCharges = 1;

        private void Awake() { Instance = this; }
        public void Bind(PlayerController controller) { player = controller; }

        private void Update()
        {
            if (GameManager.Instance == null || GameManager.Instance.State != GameState.Running) return;
            if (activeTimer > 0f) activeTimer = Mathf.Max(0f, activeTimer - Time.deltaTime);
        }

        public void AddCharge(EquipmentType type)
        {
            Selected = type;
            Charges = Mathf.Min(9, Charges + 1);
            if (type == EquipmentType.Shield) shieldCharges++;
        }

        public void Activate()
        {
            if (GameManager.Instance == null || GameManager.Instance.State != GameState.Running || Charges <= 0) return;
            Charges--;
            switch (Selected)
            {
                case EquipmentType.Magnet: activeTimer = 8f; break;
                case EquipmentType.Nitro: activeTimer = 4f; break;
                case EquipmentType.Shield: shieldCharges = Mathf.Max(shieldCharges, 1); break;
            }
        }

        public bool AbsorbHit()
        {
            if (shieldCharges <= 0) return false;
            shieldCharges--;
            return true;
        }

        public void TryMagnetize(Collectible collectible)
        {
            if (!MagnetActive || player == null || collectible == null) return;
            Vector3 delta = collectible.transform.position - player.transform.position;
            if (delta.sqrMagnitude <= 64f) collectible.CollectByMagnet(player.transform);
        }

        public void ResetRun()
        {
            activeTimer = 0f;
            Selected = EquipmentType.Shield;
            Charges = 1;
            shieldCharges = 1;
        }
    }
}
