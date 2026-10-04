using UnityEngine;

namespace UrbanRun
{
    public sealed class WorldMover : MonoBehaviour
    {
        public string PoolKey { get; private set; }
        public float DespawnZ { get; private set; }
        public void Configure(string key, float despawnZ = -14f) { PoolKey = key; DespawnZ = despawnZ; }

        private void Update()
        {
            GameManager manager = GameManager.Instance;
            if (manager == null || manager.State != GameState.Running) return;
            transform.position += Vector3.back * (manager.Speed * Time.deltaTime);
            if (transform.position.z < DespawnZ && ObjectPool.Instance != null)
                ObjectPool.Instance.Release(PoolKey, gameObject);
        }
    }
}
