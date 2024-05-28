'use client'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { loadingState } from '../providers/loadingStateProvider'

function LoadingPage() {
  const loading = useRecoilValue(loadingState)
  return (
    <>
      {loading.isLoading ? (
        <div className="fixed z-[1000] flex flex h-screen w-full flex-col items-center justify-center bg-white bg-opacity-60">
          <div
            className="text-primary inline-block h-12 w-12 animate-spin rounded-full border-[3px] border-current border-t-transparent"
            role="status"
            aria-label="loading"
          ></div>

          <div className="whitespace-pre text-center">{loading.message}</div>
        </div>
      ) : null}
    </>
  )
}

export default LoadingPage
