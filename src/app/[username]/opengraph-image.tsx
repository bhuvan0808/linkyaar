import { ImageResponse } from 'next/og'

import { getPublicProfile } from '@/services/profiles'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'LinkYaar profile'

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const data = await getPublicProfile(username)

  const name = data?.profile.display_name ?? `@${username}`
  const headline = data?.profile.headline ?? 'Everything you are. One beautiful link.'
  const avatarUrl = data?.profile.avatar_url

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #201933 0%, #14101f 55%, #0e0b18 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          width: 700,
          height: 500,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 65%)',
          filter: 'blur(40px)',
          display: 'flex',
        }}
      />
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- ImageResponse
        <img
          src={avatarUrl}
          alt=""
          width={160}
          height={160}
          style={{
            borderRadius: 9999,
            objectFit: 'cover',
            border: '4px solid rgba(255,255,255,0.2)',
          }}
        />
      ) : (
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 64,
            color: 'white',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          {username.slice(0, 2)}
        </div>
      )}
      <div
        style={{
          marginTop: 36,
          fontSize: 64,
          fontWeight: 700,
          color: 'white',
          display: 'flex',
        }}
      >
        {name}
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: 30,
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 820,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {headline}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 44,
          fontSize: 24,
          color: 'rgba(255,255,255,0.5)',
          display: 'flex',
        }}
      >
        linkyaar / {username}
      </div>
    </div>,
    size
  )
}
