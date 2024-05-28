import { GenderEnumKeys, genderEnum } from '../../enums'
import { DocRef, getDocIdWithData } from '../../libs/firebase/firestore'
import { PrivateUser } from './privateUsers.model'

export const privateUsersService = {
  async processPrivateUserData(data: PrivateUser) {
    const { onlyClubs, groupedClubStrings } = await reshapeClubs(data.clubs)
    const areasOfActivityToCities = await reshapeAreasOfActivity(
      data.areasOfActivity
    )

    return {
      ...data,
      zip: data.address.zip,
      prefecture: data.address.prefecture,
      city: data.address.city,
      gender: genderEnum[data.gender as GenderEnumKeys],
      type: data.occupation.type,
      organization: data.occupation.organization,
      userName: `${data.name.sei} ${data.name.mei}`,
      onlyClubs,
      groupedClubStrings,
      areasOfActivityToCities,
    }
  },
}

async function reshapeClubs(clubs: string[]) {
  let onlyClubs: string[] = []
  let groupedClub: { [key: string]: string[] } = {}

  await Promise.all(
    clubs.map(async (clubId): Promise<void> => {
      try {
        const clubTypeCategoriesDoc = await DocRef.clubTypeCategory(
          clubId
        ).get()
        const { largeCategory, name: clubTypeCategoryName } = getDocIdWithData(
          clubTypeCategoriesDoc
        )

        try {
          const clubTypeLargeCategoriesDoc = await DocRef.clubTypeLargeCategory(
            largeCategory
          ).get()
          const { name: clubTypeLargeCategoryName } = getDocIdWithData(
            clubTypeLargeCategoriesDoc
          )

          onlyClubs.push(clubTypeCategoryName)
          groupedClub[clubTypeLargeCategoryName] =
            groupedClub[clubTypeLargeCategoryName] || []
          groupedClub[clubTypeLargeCategoryName].push(clubTypeCategoryName)
        } catch (error) {
          console.error(
            "PrivateUser: clubTypeLargeCategory doesn't exist => clubTypeLargeCategoriesDocId: ",
            largeCategory,
            error
          )
        }
      } catch (error) {
        console.error(
          "PrivateUser: ClubTypeCategory doesn't exist => clubTypeCategoriesDocId: ",
          clubId,
          error
        )
      }
    })
  )

  return {
    onlyClubs,
    groupedClubStrings: Object.entries(groupedClub).map(([key, value]) => {
      return `${key}：${value.join('、')}`
    }),
  }
}

async function reshapeAreasOfActivity(areasOfActivity: string[]) {
  const prefAndCities: string[] = []
  await Promise.all(
    areasOfActivity.map(async (areaOfActivityId) => {
      try {
        const cityDoc = await DocRef.city(areaOfActivityId).get()
        const { prefectureText, city } = getDocIdWithData(cityDoc)
        prefAndCities.push(`${prefectureText}${city}`)
      } catch (error) {
        console.log(
          "PrivateUser: cities doesn't exist => citiesDocId : ",
          areaOfActivityId
        )
      }
    })
  )
  return prefAndCities
}
