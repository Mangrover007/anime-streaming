import { useContext, useEffect, useState } from "react";
import { PORTAL } from "../../App";
import { COMMON_URL, PROT_URL } from "../../api";
import Button from "../Button";
import type { CommentType } from "../../types";
import CommentCard from "./CommentCard";
import { useSearchParams } from "react-router-dom";


const Comment = () => {

  const { user } = useContext(PORTAL);
  const [writeComment, setWriteComment] = useState<string>("");
  const [commentList, setCommentList] = useState<CommentType[]>([]);
  const [searchParams] = useSearchParams();


  async function handleSendComment() {
    const res = await PROT_URL.post(`/comment?ep=${searchParams.get("eid")}`, {
      content: writeComment
    });
    if (res.status === 200) {
      setCommentList(prev => [...prev, res.data.data as CommentType]);
      setWriteComment("");
    }
    console.log(res);
  }

  useEffect(() => {
    async function getComments() {
      const res = await COMMON_URL.get(`/comment?id=${searchParams.get("eid")}`);
      console.log("commentador", res.data.data);
      setCommentList(res.data.data);
    }
    if (searchParams.get("eid")) {
      getComments();
    }
  }, [searchParams.get("eid")]);

  return <>

    <div
      style={{ gridArea: "box-3" }}
      className="bg-[#1e1b2e] border-t border-gray-700 p-6 space-y-6"
    >
      {
        user && <>
          {/* Comment Input */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Leave a comment</p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Write your comment..."
                className="flex-1 px-5 py-3 rounded-full text-white placeholder:text-gray-400 bg-[#1c1a2e] border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={writeComment}
                onChange={e => setWriteComment(e.target.value)}
              />
              <Button innerText="Send" onClick={handleSendComment} />
            </div>
          </div>
        </>
      }

      {/* Comment List */}
      <div className="gap-4 flex flex-col-reverse">
        {commentList.length > 0 ? (
          commentList.map((comment) => {
            return (
              <CommentCard comment={comment} setCommentList={setCommentList} />
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>


    </div>
  </>
}

export default Comment;
