export function getTileName(tileType: number): string {
  switch (tileType) {
    case 1: {
      return "wall";
    }
    case 2: {
      return "crate";
    }
    default: {
      return "unknown";
    }
  }
}
