import {
  StorageReference,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { storage } from './firebase'

export class AppStorageRef {
  static users = (path: string) => ref(storage, `users/${path}`)
  static messageRooms = (messageRoomId: string, path: string) =>
    ref(storage, `messageRooms/${messageRoomId}/${path}`)
}

export class AppStorageService {
  /**
   * 画像をアップロードする
   */
  static async uploadFile({
    ref,
    file,
  }: {
    ref: StorageReference
    file: File
  }) {
    return uploadBytes(ref, file)
  }

  /**
   * 画像のURLを取得する
   */
  static async getDownloadFileUrl(ref: StorageReference) {
    return getDownloadURL(ref)
  }
}
