using System.Collections.Generic;
using UnityEngine;

namespace UrbanRun
{
    public enum ObstacleKind { None, Block, Jump, Slide }

    public sealed class PatternValidator : MonoBehaviour
    {
        public struct PatternRow
        {
            public ObstacleKind[] Lanes;
            public PatternRow(ObstacleKind left, ObstacleKind middle, ObstacleKind right)
            { Lanes = new[] { left, middle, right }; }
        }

        public bool Validate(IList<PatternRow> rows, float spacing, float speed, float minimumReactionTime = 0.55f)
        {
            if (rows == null || rows.Count == 0 || spacing / Mathf.Max(1f, speed) < minimumReactionTime) return false;
            HashSet<int> reachable = new HashSet<int> { 0, 1, 2 };
            for (int r = 0; r < rows.Count; r++)
            {
                if (rows[r].Lanes == null || rows[r].Lanes.Length != 3) return false;
                HashSet<int> next = new HashSet<int>();
                foreach (int priorLane in reachable)
                {
                    for (int lane = Mathf.Max(0, priorLane - 1); lane <= Mathf.Min(2, priorLane + 1); lane++)
                    {
                        ObstacleKind requirement = rows[r].Lanes[lane];
                        if (requirement != ObstacleKind.Block) next.Add(lane);
                    }
                }
                if (next.Count == 0) return false;
                reachable = next;
            }
            return true;
        }

        public bool RunSelfTests()
        {
            bool safePatternsPass = true;
            for (int i = 0; i < 4; i++) safePatternsPass &= Validate(GetSafePattern(i), 17.5f, 23f);
            List<PatternRow> impossible = new List<PatternRow> { new PatternRow(ObstacleKind.Block, ObstacleKind.Block, ObstacleKind.Block) };
            bool impossibleRejected = !Validate(impossible, 17.5f, 23f);
            bool shortReactionRejected = !Validate(GetSafePattern(0), 10f, 23f);
            return safePatternsPass && impossibleRejected && shortReactionRejected;
        }

        public static IList<PatternRow> GetSafePattern(int index)
        {
            List<PatternRow> rows = new List<PatternRow>();
            switch (index % 4)
            {
                case 0:
                    rows.Add(new PatternRow(ObstacleKind.Block, ObstacleKind.None, ObstacleKind.Block));
                    rows.Add(new PatternRow(ObstacleKind.None, ObstacleKind.Jump, ObstacleKind.None));
                    rows.Add(new PatternRow(ObstacleKind.Slide, ObstacleKind.None, ObstacleKind.Block));
                    rows.Add(new PatternRow(ObstacleKind.None, ObstacleKind.Block, ObstacleKind.None));
                    break;
                case 1:
                    rows.Add(new PatternRow(ObstacleKind.None, ObstacleKind.Block, ObstacleKind.None));
                    rows.Add(new PatternRow(ObstacleKind.Jump, ObstacleKind.None, ObstacleKind.Block));
                    rows.Add(new PatternRow(ObstacleKind.Block, ObstacleKind.None, ObstacleKind.Slide));
                    rows.Add(new PatternRow(ObstacleKind.None, ObstacleKind.None, ObstacleKind.Block));
                    break;
                case 2:
                    rows.Add(new PatternRow(ObstacleKind.Block, ObstacleKind.None, ObstacleKind.Block));
                    rows.Add(new PatternRow(ObstacleKind.None, ObstacleKind.Slide, ObstacleKind.None));
                    rows.Add(new PatternRow(ObstacleKind.Jump, ObstacleKind.Block, ObstacleKind.None));
                    rows.Add(new PatternRow(ObstacleKind.None, ObstacleKind.Block, ObstacleKind.None));
                    break;
                default:
                    rows.Add(new PatternRow(ObstacleKind.None, ObstacleKind.Block, ObstacleKind.None));
                    rows.Add(new PatternRow(ObstacleKind.Block, ObstacleKind.Jump, ObstacleKind.None));
                    rows.Add(new PatternRow(ObstacleKind.None, ObstacleKind.Block, ObstacleKind.Slide));
                    rows.Add(new PatternRow(ObstacleKind.Block, ObstacleKind.None, ObstacleKind.None));
                    break;
            }
            return rows;
        }
    }
}
