# Technologies

- Vite application
- React (Tailwindcss)
- TypeScript

# Project Setup

Install this app and run on your device with commands

```
git clone
npm i
npm run dev
```

# Note

Integrate with capybara-server if you want to use all features.

# Add minigame

1. Create a node under /src/components/minigames
2. Use useMinigames hook on the game page

```
let {
    currentMinigame,
    isOpen,
    isCompleted,
    isClosed,
    openMinigame,
    closeMinigame,
    completeMinigame,
    resetMinigame,
  } = useMinigames();
```

3. Add Minigame component

```
<Minigame
    isOpen={isOpen}
    minigame={currentMinigame}
    closeMinigame={closeMinigame}
/>
```

4. Use openMinigame() funciton to open the minigame

```
openMinigame(<YourMinigame completeMinigame={completeMinigame} />)
```

5. Observe the minigame result

```
useEffect(() => {
    if (isCompleted) {
      resetMinigame();
      alert("completed");
    } else if (isClosed) {
      resetMinigame();
      alert("closed");
    }
  }, [isCompleted, isClosed]);
```
