using UnityEngine;

namespace UrbanRun
{
    public enum CollectibleKind { Water, Fuel, Equipment }
    public enum EquipmentType { Magnet, Nitro, Shield }

    public sealed class Collectible : MonoBehaviour
    {
        public CollectibleKind Kind { get; private set; }
        public EquipmentType Equipment { get; private set; }
        private bool collected;

        public void Configure(CollectibleKind kind, EquipmentType equipment = EquipmentType.Shield)
        { Kind = kind; Equipment = equipment; collected = false; }

        private void Update()
        {
            transform.Rotate(Vector3.up, 110f * Time.deltaTime, Space.World);
            if (EquipmentSystem.Instance != null && (Kind == CollectibleKind.Water || Kind == CollectibleKind.Fuel))
                EquipmentSystem.Instance.TryMagnetize(this);
        }

        private void OnTriggerEnter(Collider other)
        {
            if (collected || other.GetComponentInParent<PlayerController>() == null) return;
            collected = true;
            if (Kind == CollectibleKind.Equipment) EquipmentSystem.Instance?.AddCharge(Equipment);
            else GameManager.Instance?.RegisterResource(Kind);
            Recycle();
        }

        public void CollectByMagnet(Transform target)
        {
            if (collected || target == null || GameManager.Instance == null || GameManager.Instance.State != GameState.Running) return;
            float speed = GameManager.Instance.Speed;
            transform.position = Vector3.MoveTowards(transform.position, target.position + Vector3.up, speed * Time.deltaTime * 1.8f);
        }

        private void Recycle()
        {
            WorldMover mover = GetComponent<WorldMover>();
            if (mover != null && ObjectPool.Instance != null) ObjectPool.Instance.Release(mover.PoolKey, gameObject);
        }
    }
}
