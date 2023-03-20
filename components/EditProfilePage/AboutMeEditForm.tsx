import clsx from "clsx"
import { ChangeEvent, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, Form, Row, Col } from "../bootstrap"
import { Profile, ProfileHook } from "../db"
import Input from "../forms/Input"
import { TitledSectionCard } from "../shared"
import { Header } from "../shared/TitledSectionCard"
import { ImageInput } from "./ImageInput"
import { YourLegislators } from "./YourLegislators"

type UpdateProfileData = {
  name: string
  aboutYou: string
  twitter: string
  linkedIn: string
  organization: boolean
  profileImage: any
}

type Props = {
  profile: Profile
  actions: ProfileHook
  uid?: string
  setFormUpdated?: any
  className?: string
}

async function updateProfile(
  { profile, actions, uid }: Props,
  data: UpdateProfileData
) {
  const { updateSocial, updateAbout, updateDisplayName, updateFullName } =
    actions

  await updateSocial("linkedIn", data.linkedIn)
  await updateSocial("twitter", data.twitter)
  await updateAbout(data.aboutYou)
  await updateDisplayName(data.name)
  await updateFullName(data.name)
}

export function AboutMeEditForm({
  profile,
  actions,
  uid,
  className,
  setFormUpdated
}: Props) {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit
  } = useForm<UpdateProfileData>()

  const { displayName, about, role, social, profileImage }: Profile = profile

  const { updateIsOrganization } = actions

  const handleChooseUserType = async (e: ChangeEvent<HTMLSelectElement>) => {
    await updateIsOrganization(e.target.value === "organization")
  }

  const isOrganization = role === "organization"

  const onSubmit = handleSubmit(async update => {
    await updateProfile({ profile, actions }, update)

    handleRedirect()
  })

  const handleRedirect = () => {
    //redirect user to profile page
    isOrganization
      ? location.assign(`/organization?id=${uid}`)
      : location.assign(`/profile?=${uid}`)
  }

  useEffect(() => {
    setFormUpdated(isDirty)
  }, [isDirty, setFormUpdated])

  return (
    <TitledSectionCard className={className}>
      <Form onSubmit={onSubmit}>
        <Header title={"About You"}></Header>
        <div className={`mx-4 mt-3 d-flex flex-column gap-3`}>
          {/* <Form.FloatingLabel label="User Type" className="mb-3">
            <Form.Select
              className="bg-white"
              {...register("organization")}
              defaultValue={organization ? "organization" : "individual"}
              onChange={handleChooseUserType}
            >
              <option value="organization">Organization</option>
              <option value="individual">Individual</option>
            </Form.Select>
          </Form.FloatingLabel> */}
          <Input
            label="Name"
            {...register("name")}
            defaultValue={displayName}
          />
          <Input
            as="textarea"
            {...register("aboutYou")}
            style={{ height: "20rem" }}
            label="Write something about yourself"
            defaultValue={about}
          />
          <div className={clsx("w-100", isOrganization && "row")}>
            {isOrganization && <ImageInput />}
            <div className="row">
              <Input
                label="Twitter Username"
                defaultValue={social?.twitter}
                className=" w-50"
                {...register("twitter")}
              />
              <Input
                label="LinkedIn Username"
                defaultValue={social?.linkedIn}
                className="w-50"
                {...register("linkedIn")}
              />
            </div>
          </div>
          <Row className="align-items-center justify-content-center mb-3">
            <Col className="align-items-center" xs="auto">
              <Button className="flex-grow-0 mt-5 mx-auto py-1" type="submit">
                Save Profile
              </Button>
            </Col>
            <Col className="align-items-center" xs="auto">
              <Button
                className="flex-grow-0 mt-5 mx-auto py-1"
                href="/profile"
                style={{ backgroundColor: "var(--bs-blue)" }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
      {!isOrganization && (
        <>
          <Header title="Your Legislators"></Header>
          <YourLegislators />
        </>
      )}
    </TitledSectionCard>
  )
}
