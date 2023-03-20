import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore"
import { firestore } from "../firebase"
import { Button, Col, Stack } from "../bootstrap"
import { useState, useEffect } from "react"
import {
  Header,
  StyledImage,
  ProfileDisplayName,
  OrgIconLarge,
  UserIcon
} from "./StyledProfileComponents"
import { EditProfileButton } from "./EditProfileButton"
import { OrgContactInfo } from "./OrgContactInfo"
import { Profile } from "../db"
import { FollowButton } from "./FollowButton"

export const ProfileHeader = ({
  isUser,
  isOrg,
  isMobile,
  uid,
  profileid,
  profile
}: {
  isUser: boolean
  isOrg: boolean
  isMobile: boolean
  uid?: string
  profileid: string
  profile: Profile
}) => {
  const displayName = profile.displayName
    ? profile.displayName
    : "Anonymous User"
  const imageSrc = profile.profileImage
    ? profile.profileImage
    : "/profile-org-icon.svg"
  const topicName = `org-${profileid}`
  const subscriptionRef = collection(
    firestore,
    `/users/${uid}/activeTopicSubscriptions/`
  )
  const [queryResult, setQueryResult] = useState("")

  const orgQuery = async () => {
    const q = query(
      subscriptionRef,
      where("topicName", "==", `org-${profileid}`)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      setQueryResult(doc.data().topicName)
    })
  }

  useEffect(() => {
    uid ? orgQuery() : null
  })

  const handleFollowClick = async () => {
    await setDoc(doc(subscriptionRef, topicName), {
      topicName: topicName,
      uid: uid,
      profileid: profileid,
      type: "org"
    })

    setQueryResult(topicName)
  }

  const handleUnfollowClick = async () => {
    await deleteDoc(doc(subscriptionRef, topicName))

    setQueryResult("")
  }

  return (
    <Header className={`gx-0 edit-profile-header`}>
      {isOrg ? (
        <Col xs={"auto"} className={"col-auto"}>
          <OrgIconLarge className={`col d-none d-sm-flex`} src={imageSrc} />
        </Col>
      ) : (
        <Col xs={"auto"}>
          <UserIcon />
        </Col>
      )}
      <Col>
        <Stack gap={2}>
          <ProfileDisplayName className={`overflow-hidden`}>
            {displayName}
          </ProfileDisplayName>

          {isOrg && (
            <>
              {isUser ? (
                <EditProfileButton isMobile={isMobile} />
              ) : (
                <FollowButton
                  onFollowClick={() => handleFollowClick()}
                  onUnfollowClick={() => handleUnfollowClick()}
                  isMobile={isMobile}
                  isFollowing={queryResult}
                />
              )}
            </>
          )}
        </Stack>
      </Col>
      <Col>
        {isOrg ? (
          <OrgContactInfo profile={profile} />
        ) : (
          <div>{isUser && <EditProfileButton isMobile={isMobile} />}</div>
        )}
      </Col>
    </Header>
  )
}
