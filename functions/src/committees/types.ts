import {
  Number,
  Record,
  Static,
  String,
  Array,
  InstanceOf,
  Optional
} from "runtypes"
import { Id } from "../common"
import { Timestamp } from "../firebase"

export type CommitteeListItem = Static<typeof CommitteeListItem>
export const CommitteeListItem = Record({
  CommitteeCode: String,
  GeneralCourtNumber: Number
})

export type CommitteeListing = Static<typeof CommitteeListing>
export const CommitteeListing = Array(CommitteeListItem)

export type CommitteeContent = Static<typeof CommitteeContent>
export const CommitteeContent = Record({
  CommitteeCode: String,
  DocumentsBeforeCommittee: Array(String),
  ReportedOutDocuments: Array(String)
})

export type Committee = Static<typeof Committee>
export const Committee = Record({
  id: Id,
  content: CommitteeContent,
  members: Optional(Array(Record({ id: String, name: String }))),
  fetchedAt: InstanceOf(Timestamp)
})
