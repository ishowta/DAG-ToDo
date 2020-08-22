export function checkIsRemoteMode(): boolean {
  return getRoomName() !== null
}

export function getRoomName(): string | null {
  const key = window.location.pathname
  if (key === `/`) {
    return null
  }
  return key.split('/')[1]
}
