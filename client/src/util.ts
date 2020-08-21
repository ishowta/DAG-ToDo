export function isRemoteMode(): boolean {
  return getRoomName() !== null
}

export function getRoomName(): string | null {
  const key = window.location.pathname
  if (key === `/`) {
    return null
  } else {
    return key.split('/')[1]
  }
}
