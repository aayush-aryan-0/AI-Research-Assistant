import { ParamValue } from "next/dist/server/request/params"

type Chat = {
  id: string,
  project_id: ParamValue,
  title: string,
  timestamp: string
}

export default Chat