using System.Collections.Generic;
using UnityEngine;

namespace UrbanRun
{
    public sealed class ObjectPool : MonoBehaviour
    {
        public static ObjectPool Instance { get; private set; }
        private readonly Dictionary<string, GameObject> prototypes = new Dictionary<string, GameObject>();
        private readonly Dictionary<string, Stack<GameObject>> inactive = new Dictionary<string, Stack<GameObject>>();
        private readonly HashSet<GameObject> active = new HashSet<GameObject>();

        private void Awake() { Instance = this; }

        public void Register(string key, GameObject prototype)
        {
            prototypes[key] = prototype;
            if (!inactive.ContainsKey(key)) inactive[key] = new Stack<GameObject>();
            prototype.name = key + "_Prototype";
            prototype.SetActive(false);
        }

        public GameObject Get(string key, Vector3 position, Quaternion rotation)
        {
            if (!prototypes.ContainsKey(key)) { Debug.LogError("Pool key not registered: " + key); return null; }
            Stack<GameObject> stack = inactive[key];
            GameObject item = stack.Count > 0 ? stack.Pop() : Instantiate(prototypes[key]);
            item.transform.SetPositionAndRotation(position, rotation);
            item.SetActive(true);
            active.Add(item);
            return item;
        }

        public void Release(string key, GameObject item)
        {
            if (item == null || !prototypes.ContainsKey(key) || !active.Remove(item)) return;
            item.SetActive(false);
            inactive[key].Push(item);
        }

        public void ReleaseAll()
        {
            GameObject[] copy = new GameObject[active.Count];
            active.CopyTo(copy);
            foreach (GameObject item in copy)
            {
                WorldMover mover = item.GetComponent<WorldMover>();
                if (mover != null) Release(mover.PoolKey, item);
                else item.SetActive(false);
            }
        }
    }
}
