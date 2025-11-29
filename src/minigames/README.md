# Add minigames to levels

1. Create a node under /src/components/minigames
2. Define state for the current minigame

```
const [currentMinigame, setCurrentMinigame] = useState<Minigame | null>(null);
```

3. Make a list of all minigames in the level (usage of useMemo recommended)

```
const minigames: Minigame[] = useMemo(() => [
  {
      name: "...",
      content: (
        <...
          completeMinigame={() => {
            setCurrentMinigame(null);
            ...
          }}
        />
      ),
    },
], [])
```

4. Include minigame container on the level

```
{currentMinigame && (
  <MinigameContainer
    isOpen={currentMinigame !== null}
    onClose={() => setCurrentMinigame(null)}
    minigame={currentMinigame}
  />
)}
```

5. Make button or sth else to open minigame

```
<button
  onClick={() => {
    setCurrentMinigame(
      minigames.find((m) => m.name == "...") ?? null,
    );
  }}
>
  ...
</button>
```
