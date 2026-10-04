using UnityEngine;

namespace UrbanRun
{
    public static class GameBootstrapper
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void BuildPrototype()
        {
            if (GameManager.Instance != null) return;
            Screen.orientation = ScreenOrientation.Portrait;
            Application.targetFrameRate = 60;
            QualitySettings.vSyncCount = 0;

            GameManager manager = new GameObject("UrbanRun_GameManager").AddComponent<GameManager>();
            ObjectPool pool = new GameObject("UrbanRun_ObjectPool").AddComponent<ObjectPool>();
            EquipmentSystem equipment = new GameObject("UrbanRun_EquipmentSystem").AddComponent<EquipmentSystem>();
            TrackSpawner spawner = new GameObject("UrbanRun_TrackSpawner").AddComponent<TrackSpawner>();
            PatternValidator validator = new GameObject("UrbanRun_PatternValidator").AddComponent<PatternValidator>();
            if (!validator.RunSelfTests()) Debug.LogError("PatternValidator self-tests failed.");

            RegisterPools(pool);
            spawner.Bind(pool, validator);

            PlayerController player = CreatePlayer();
            equipment.Bind(player);
            WardenController warden = CreateWarden();
            manager.Bind(player, spawner, warden);
            spawner.ResetWorld();
            new GameObject("UrbanRun_HUD").AddComponent<HUDController>();
            CreateCamera();
            Debug.Log("Urban Run MVP bootstrapped. Start a run from the on-screen button or use arrow/WASD controls.");
        }

        private static PlayerController CreatePlayer()
        {
            GameObject root = new GameObject("Runner");
            root.tag = "Player";
            root.transform.position = Vector3.zero;
            CharacterController controller = root.AddComponent<CharacterController>();
            controller.height = 2f; controller.radius = 0.42f; controller.center = new Vector3(0f, 1f, 0f);
            PlayerController player = root.AddComponent<PlayerController>();
            GameObject body = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            body.name = "Runner_Visual"; body.transform.SetParent(root.transform, false);
            body.transform.localPosition = new Vector3(0f, 1f, 0f); body.transform.localScale = new Vector3(0.72f, 0.9f, 0.72f);
            Collider visualCollider = body.GetComponent<Collider>(); if (visualCollider != null) Object.Destroy(visualCollider);
            body.GetComponent<Renderer>().material = MakeMaterial(new Color(0.20f, 0.73f, 0.74f));
            return player;
        }

        private static WardenController CreateWarden()
        {
            GameObject warden = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            warden.name = "The_Warden"; warden.transform.position = new Vector3(0f, 0.05f, -4f);
            Collider collider = warden.GetComponent<Collider>(); if (collider != null) Object.Destroy(collider);
            warden.GetComponent<Renderer>().material = MakeMaterial(new Color(0.82f, 0.30f, 0.16f));
            return warden.AddComponent<WardenController>();
        }

        private static void RegisterPools(ObjectPool pool)
        {
            pool.Register(TrackSpawner.TileKey, CreateTrackTile());
            pool.Register("Obstacle_Block", CreateObstacle(ObstacleKind.Block));
            pool.Register("Obstacle_Jump", CreateObstacle(ObstacleKind.Jump));
            pool.Register("Obstacle_Slide", CreateObstacle(ObstacleKind.Slide));
            pool.Register("Collectible_Water", CreateCollectible(CollectibleKind.Water, new Color(0.10f, 0.64f, 1f)));
            pool.Register("Collectible_Fuel", CreateCollectible(CollectibleKind.Fuel, new Color(1f, 0.55f, 0.08f)));
            pool.Register("Collectible_Equipment", CreateCollectible(CollectibleKind.Equipment, new Color(0.75f, 0.35f, 1f)));
        }

        private static GameObject CreateTrackTile()
        {
            GameObject root = new GameObject("TrackTilePrototype");
            GameObject road = GameObject.CreatePrimitive(PrimitiveType.Cube);
            road.name = "Road"; road.transform.SetParent(root.transform, false);
            road.transform.localPosition = Vector3.zero; road.transform.localScale = new Vector3(8f, 0.5f, 30f);
            road.GetComponent<Renderer>().material = MakeMaterial(new Color(0.23f, 0.25f, 0.25f));
            for (int side = -1; side <= 1; side += 2)
            {
                GameObject building = GameObject.CreatePrimitive(PrimitiveType.Cube);
                building.name = "Ruined_Structure"; building.transform.SetParent(root.transform, false);
                building.transform.localPosition = new Vector3(side * 6.3f, 2.1f, 0f);
                building.transform.localScale = new Vector3(3.5f, 4.7f, 30f);
                building.GetComponent<Renderer>().material = MakeMaterial(side < 0 ? new Color(0.33f, 0.31f, 0.28f) : new Color(0.37f, 0.34f, 0.29f));
            }
            root.AddComponent<WorldMover>();
            return root;
        }

        private static GameObject CreateObstacle(ObstacleKind kind)
        {
            GameObject go = new GameObject("Obstacle_" + kind);
            BoxCollider box = go.AddComponent<BoxCollider>(); box.isTrigger = true;
            Vector3 visualSize;
            Vector3 visualCenter;
            if (kind == ObstacleKind.Jump)
            {
                box.center = new Vector3(0f, 0.30f, 0f); box.size = new Vector3(1.8f, 0.60f, 1.25f);
                visualCenter = box.center; visualSize = box.size;
            }
            else if (kind == ObstacleKind.Slide)
            {
                box.center = new Vector3(0f, 1.58f, 0f); box.size = new Vector3(1.9f, 0.32f, 1.35f);
                visualCenter = box.center; visualSize = box.size;
            }
            else
            {
                box.center = new Vector3(0f, 1.05f, 0f); box.size = new Vector3(1.9f, 2.1f, 2.1f);
                visualCenter = box.center; visualSize = box.size;
            }
            GameObject visual = GameObject.CreatePrimitive(PrimitiveType.Cube);
            visual.name = "ObstacleVisual"; visual.transform.SetParent(go.transform, false);
            visual.transform.localPosition = visualCenter; visual.transform.localScale = visualSize;
            Collider visualCollider = visual.GetComponent<Collider>(); if (visualCollider != null) Object.DestroyImmediate(visualCollider);
            Color color = kind == ObstacleKind.Jump ? new Color(0.92f, 0.66f, 0.16f)
                : kind == ObstacleKind.Slide ? new Color(0.77f, 0.36f, 0.18f) : new Color(0.42f, 0.39f, 0.35f);
            visual.GetComponent<Renderer>().material = MakeMaterial(color);
            go.AddComponent<Obstacle>().Configure(kind);
            go.AddComponent<WorldMover>();
            return go;
        }

        private static GameObject CreateCollectible(CollectibleKind kind, Color color)
        {
            GameObject go = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            go.name = "Collectible_" + kind;
            Collider collider = go.GetComponent<Collider>(); if (collider != null) Object.DestroyImmediate(collider);
            SphereCollider sphere = go.AddComponent<SphereCollider>(); sphere.isTrigger = true; sphere.radius = kind == CollectibleKind.Equipment ? 0.68f : 0.58f;
            go.transform.localScale = kind == CollectibleKind.Equipment ? Vector3.one * 0.85f : Vector3.one * 0.58f;
            go.GetComponent<Renderer>().material = MakeMaterial(color);
            go.AddComponent<Collectible>().Configure(kind);
            go.AddComponent<WorldMover>();
            return go;
        }

        private static void CreateCamera()
        {
            Camera camera = Camera.main;
            if (camera == null)
            {
                GameObject go = new GameObject("Main Camera"); go.tag = "MainCamera"; camera = go.AddComponent<Camera>();
            }
            camera.transform.position = new Vector3(0f, 4.6f, -8.5f);
            camera.transform.LookAt(new Vector3(0f, 1.1f, 12f));
            camera.fieldOfView = 58f; camera.backgroundColor = new Color(0.48f, 0.62f, 0.65f);
        }

        private static Material MakeMaterial(Color color)
        {
            Shader shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null) shader = Shader.Find("Standard");
            if (shader == null) shader = Shader.Find("Unlit/Color");
            Material material = new Material(shader) { color = color };
            return material;
        }
    }
}
