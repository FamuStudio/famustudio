using UnityEngine;

namespace UrbanRun
{
    public sealed class HUDController : MonoBehaviour
    {
        private GUIStyle titleStyle, labelStyle, buttonStyle, smallStyle;
        private void OnGUI()
        {
            if (GameManager.Instance == null) return;
            EnsureStyles();
            Rect safe = Screen.safeArea;
            Rect guiSafe = new Rect(safe.xMin, Screen.height - safe.yMax, safe.width, safe.height);
            GUI.BeginGroup(guiSafe);
            float w = guiSafe.width, h = guiSafe.height;
            GameManager gm = GameManager.Instance;

            if (gm.State == GameState.MainMenu || gm.State == GameState.Boot)
            {
                DrawCentered("URBAN RUN\nWASTELAND ESCAPE", h * 0.25f, titleStyle, w);
                DrawCentered("Foge. Recolhe. Sobrevive.", h * 0.42f, labelStyle, w);
                if (GUI.Button(new Rect(w * 0.2f, h * 0.58f, w * 0.6f, 64f), "INICIAR CORRIDA", buttonStyle)) gm.StartRun();
            }
            else if (gm.State == GameState.Running || gm.State == GameState.Paused)
            {
                GUI.Label(new Rect(18f, 14f, w * 0.65f, 38f), "SCORE  " + gm.Score + "    x" + gm.Multiplier, labelStyle);
                GUI.Label(new Rect(18f, 54f, w * 0.8f, 34f), "DISTÂNCIA  " + Mathf.FloorToInt(gm.Distance) + " m", smallStyle);
                GUI.Label(new Rect(18f, 86f, w * 0.8f, 30f), "WATER " + gm.Water + "    FUEL " + gm.Fuel, smallStyle);
                GUI.Label(new Rect(18f, 120f, w * 0.78f, 32f), "WARDEN", smallStyle);
                GUI.Box(new Rect(18f, 150f, w * 0.72f, 16f), "");
                GUI.color = gm.EscapeMeter < 30f ? new Color(0.9f, 0.22f, 0.12f) : new Color(0.25f, 0.85f, 0.55f);
                GUI.Box(new Rect(20f, 152f, (w * 0.72f - 4f) * gm.EscapeMeter / 100f, 12f), "");
                GUI.color = Color.white;
                if (GUI.Button(new Rect(w - 108f, 16f, 90f, 48f), gm.State == GameState.Paused ? "RETOMAR" : "PAUSA", buttonStyle)) gm.TogglePause();
                if (GUI.Button(new Rect(w - 178f, h - 92f, 158f, 66f), EquipmentLabel(), buttonStyle)) gm.ActivateEquipment();
                if (gm.State == GameState.Paused) DrawCentered("PAUSA", h * 0.40f, titleStyle, w);
            }
            else if (gm.State == GameState.GameOver || gm.State == GameState.Results)
            {
                DrawCentered("CAPTURADO", h * 0.20f, titleStyle, w);
                DrawCentered("PONTUAÇÃO  " + gm.Score + "\nDISTÂNCIA  " + Mathf.FloorToInt(gm.Distance) + " m\nWATER " + gm.Water + "   FUEL " + gm.Fuel + "\nRECORDE  " + SaveManager.BestScore, labelStyle, w);
                if (GUI.Button(new Rect(w * 0.2f, h * 0.62f, w * 0.6f, 64f), "TENTAR NOVAMENTE", buttonStyle)) gm.StartRun();
                if (GUI.Button(new Rect(w * 0.2f, h * 0.74f, w * 0.6f, 56f), "MENU", buttonStyle)) gm.SetState(GameState.MainMenu);
            }
            GUI.EndGroup();
        }

        private string EquipmentLabel()
        {
            EquipmentSystem eq = EquipmentSystem.Instance;
            return eq == null ? "EQUIPAMENTO" : "USAR " + eq.Selected.ToString().ToUpperInvariant() + "  (" + eq.Charges + ")";
        }

        private void DrawCentered(string text, float y, GUIStyle style, float width)
        {
            GUI.Label(new Rect(width * 0.08f, y, width * 0.84f, 145f), text, style);
        }

        private void EnsureStyles()
        {
            if (titleStyle != null) return;
            titleStyle = new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = Mathf.Clamp(Screen.width / 18, 24, 44), fontStyle = FontStyle.Bold, wordWrap = true };
            labelStyle = new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = Mathf.Clamp(Screen.width / 28, 16, 28), wordWrap = true };
            buttonStyle = new GUIStyle(GUI.skin.button) { fontSize = Mathf.Clamp(Screen.width / 32, 15, 23), fontStyle = FontStyle.Bold };
            smallStyle = new GUIStyle(GUI.skin.label) { fontSize = Mathf.Clamp(Screen.width / 38, 14, 20), fontStyle = FontStyle.Bold };
        }
    }
}
