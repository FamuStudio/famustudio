using UnityEngine;

namespace UrbanRun
{
    public sealed class WardenController : MonoBehaviour
    {
        public float Meter { get; private set; } = 100f;
        private const float PassivePressurePerSecond = 0.08f;

        private void Update()
        {
            transform.position = new Vector3(1.35f, 0.05f + Mathf.Sin(Time.time * 8f) * 0.04f, -2f - Meter * 0.035f);
            if (GameManager.Instance == null || GameManager.Instance.State != GameState.Running) return;
            Meter = Mathf.Max(0f, Meter - PassivePressurePerSecond * Time.deltaTime);
            if (Meter <= 0f) GameManager.Instance.EndRun(true);
        }

        public void Reduce(float amount)
        {
            Meter = Mathf.Max(0f, Meter - amount);
            if (Meter <= 0f) GameManager.Instance?.EndRun(true);
        }

        public void Recover(float amount) { Meter = Mathf.Min(100f, Meter + amount); }
        public void ResetMeter() { Meter = 100f; }
    }
}
