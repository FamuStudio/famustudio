using System.Collections.Generic;
using UnityEngine;

namespace UrbanRun
{
    public sealed class TrackSpawner : MonoBehaviour
    {
        public const string TileKey = "TrackTile";
        private const float LeadDistance = 58f;
        private const float TileLength = 30f;
        private ObjectPool pool;
        private PatternValidator validator;
        private float rowTimer;
        private float tileTimer;
        private int patternIndex;

        public void Bind(ObjectPool objectPool, PatternValidator patternValidator)
        { pool = objectPool; validator = patternValidator; }

        public void ResetWorld()
        {
            if (pool == null) return;
            pool.ReleaseAll();
            rowTimer = 0f; tileTimer = 0f; patternIndex = 0;
            SpawnTile(-15f); SpawnTile(15f); SpawnTile(45f);
        }

        private void Update()
        {
            if (pool == null || GameManager.Instance == null || GameManager.Instance.State != GameState.Running) return;
            tileTimer -= Time.deltaTime;
            if (tileTimer <= 0f)
            {
                SpawnTile(45f);
                tileTimer = TileLength / Mathf.Max(1f, GameManager.Instance.Speed);
            }
            rowTimer -= Time.deltaTime;
            if (rowTimer <= 0f)
            {
                SpawnPatternRow();
                float spacing = Mathf.Max(12f, GameManager.Instance.Speed * 0.76f);
                rowTimer = spacing / Mathf.Max(1f, GameManager.Instance.Speed);
            }
        }

        private void SpawnPatternRow()
        {
            IList<PatternValidator.PatternRow> pattern = PatternValidator.GetSafePattern(patternIndex / 4);
            float spacing = Mathf.Max(12f, GameManager.Instance.Speed * 0.76f);
            if (validator != null && !validator.Validate(pattern, spacing, GameManager.Instance.Speed))
            {
                Debug.LogWarning("Rejected an unsafe pattern; using an empty recovery row.");
                SpawnResourceRow(LeadDistance);
                return;
            }
            PatternValidator.PatternRow row = pattern[patternIndex % pattern.Count];
            patternIndex++;
            int resourceLane = Random.Range(0, 3);
            for (int lane = 0; lane < 3; lane++)
            {
                float x = (lane - 1) * PlayerController.LaneWidth;
                ObstacleKind kind = row.Lanes[lane];
                if (kind != ObstacleKind.None) SpawnObstacle(kind, x, LeadDistance);
                else if (lane == resourceLane || Random.value > 0.55f) SpawnResource(Random.value > 0.5f ? CollectibleKind.Water : CollectibleKind.Fuel, x, LeadDistance);
            }
            if (patternIndex % 7 == 0)
            {
                int safeLane = Random.Range(0, 3);
                if (row.Lanes[safeLane] == ObstacleKind.None)
                    SpawnEquipment((EquipmentType)Random.Range(0, 3), (safeLane - 1) * PlayerController.LaneWidth, LeadDistance + 3f);
            }
        }

        private void SpawnResourceRow(float z)
        {
            SpawnResource(CollectibleKind.Water, -PlayerController.LaneWidth, z);
            SpawnResource(CollectibleKind.Fuel, PlayerController.LaneWidth, z);
        }

        private void SpawnTile(float z)
        {
            GameObject tile = pool.Get(TileKey, new Vector3(0f, -0.25f, z), Quaternion.identity);
            if (tile != null) tile.GetComponent<WorldMover>().Configure(TileKey, -TileLength);
        }

        private void SpawnObstacle(ObstacleKind kind, float x, float z)
        {
            string key = "Obstacle_" + kind;
            GameObject go = pool.Get(key, new Vector3(x, 0f, z), Quaternion.identity);
            if (go == null) return;
            go.GetComponent<Obstacle>().Configure(kind);
            go.GetComponent<WorldMover>().Configure(key);
        }

        private void SpawnResource(CollectibleKind kind, float x, float z)
        {
            string key = "Collectible_" + kind;
            GameObject go = pool.Get(key, new Vector3(x, 1f, z), Quaternion.identity);
            if (go == null) return;
            go.GetComponent<Collectible>().Configure(kind);
            go.GetComponent<WorldMover>().Configure(key);
        }

        private void SpawnEquipment(EquipmentType type, float x, float z)
        {
            const string key = "Collectible_Equipment";
            GameObject go = pool.Get(key, new Vector3(x, 1.15f, z), Quaternion.identity);
            if (go == null) return;
            go.GetComponent<Collectible>().Configure(CollectibleKind.Equipment, type);
            go.GetComponent<WorldMover>().Configure(key);
        }
    }
}
