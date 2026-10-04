using System;
using UnityEngine;

namespace UrbanRun
{
    public sealed class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }
        public GameState State { get; private set; } = GameState.Boot;
        public float Distance { get; private set; }
        public int Score { get; private set; }
        public int Water { get; private set; }
        public int Fuel { get; private set; }
        public int Multiplier { get; private set; } = 1;
        public int Combo { get; private set; }
        public int Hits { get; private set; }
        public float Speed { get; private set; } = 10f;
        public float EscapeMeter => warden != null ? warden.Meter : 100f;
        public event Action Changed;

        private PlayerController player;
        private TrackSpawner spawner;
        private WardenController warden;
        private float perfectTimer;
        private const float StartingSpeed = 10f;
        private const float MaximumSpeed = 23f;

        private void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
            SetState(GameState.MainMenu);
        }

        public void Bind(PlayerController playerController, TrackSpawner trackSpawner, WardenController wardenController)
        {
            player = playerController;
            spawner = trackSpawner;
            warden = wardenController;
        }

        private void Update()
        {
            if (State != GameState.Running) return;
            float dt = Time.deltaTime;
            float equipmentMultiplier = EquipmentSystem.Instance != null ? EquipmentSystem.Instance.SpeedMultiplier : 1f;
            Speed = Mathf.Min(MaximumSpeed, (StartingSpeed + Distance * 0.012f) * equipmentMultiplier);
            Distance += Speed * dt;
            Score += Mathf.RoundToInt(Speed * dt * Multiplier);
            perfectTimer += dt;
            if (perfectTimer >= 5f) { perfectTimer = 0f; RegisterPerfect(); }
            Changed?.Invoke();
        }

        public void StartRun()
        {
            if (State == GameState.Running) return;
            Distance = 0; Score = 0; Water = 0; Fuel = 0; Hits = 0; Combo = 0; Multiplier = 1;
            Speed = StartingSpeed; perfectTimer = 0f;
            if (spawner != null) spawner.ResetWorld();
            if (player != null) player.ResetRunner();
            if (warden != null) warden.ResetMeter();
            EquipmentSystem.Instance?.ResetRun();
            SetState(GameState.Running);
        }

        public void TogglePause()
        {
            if (State == GameState.Running) SetState(GameState.Paused);
            else if (State == GameState.Paused) SetState(GameState.Running);
        }

        public void RegisterResource(CollectibleKind kind)
        {
            if (kind == CollectibleKind.Water) { Water++; SaveManager.AddWater(1); }
            else if (kind == CollectibleKind.Fuel) { Fuel++; SaveManager.AddFuel(1); }
            Score += 10 * Multiplier;
            Combo++;
            UpdateMultiplier();
            Changed?.Invoke();
        }

        public void RegisterPerfect()
        {
            if (State != GameState.Running) return;
            Combo++;
            UpdateMultiplier();
            warden?.Recover(1.5f);
        }

        public void RegisterNearMiss()
        {
            Score += 25 * Multiplier;
            RegisterPerfect();
        }

        public void ApplyObstacleHit()
        {
            if (State != GameState.Running) return;
            if (EquipmentSystem.Instance != null && EquipmentSystem.Instance.AbsorbHit())
            {
                Changed?.Invoke();
                return;
            }
            Hits++;
            Combo = 0;
            Multiplier = 1;
            warden?.Reduce(28f);
            if (Hits >= 3 || (warden != null && warden.Meter <= 0f)) EndRun(true);
            else Changed?.Invoke();
        }

        public void EndRun(bool captured)
        {
            if (State == GameState.GameOver || State == GameState.Results) return;
            SetState(GameState.GameOver);
            SaveManager.SaveRecord(Score);
            Changed?.Invoke();
        }

        public void ActivateEquipment() => EquipmentSystem.Instance?.Activate();

        public void SetState(GameState next)
        {
            State = next;
            Changed?.Invoke();
        }

        private void UpdateMultiplier()
        {
            Multiplier = Mathf.Clamp(1 + Combo / 8, 1, 5);
        }
    }
}
