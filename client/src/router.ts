export function checkIsRemoteMode(): boolean {
  return getRoomName() !== null
}

export type RemoteConfig = {
  roomName: string
}

export function fetchRemoteConfig(): RemoteConfig | undefined {
  return checkIsRemoteMode()
    ? {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        roomName: getRoomName() as string,
      }
    : undefined
}

function getRoomName(): string | null {
  const key = window.location.pathname
  if (key === `/`) {
    return null
  }
  return key.split('/')[1]
}
