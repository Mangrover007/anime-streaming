import { useContext, useEffect, useState } from "react";
import { PORTAL } from "../App";
import { COMMON_URL, PROT_URL } from "../api";
import Button from "./Button";
import type { CommentType, Episode } from "./Watch";

type CommentProps = {
  episode: Episode | undefined
}

const Comment = ({ episode }: CommentProps) => {

  const { user } = useContext(PORTAL);
  const [writeComment, setWriteComment] = useState<string>("");
  const [commentList, setCommentList] = useState<CommentType[]>([]);

  async function handleSendComment() {
    const res = await PROT_URL.post(`/comment?ep=${episode?.id}`, {
      content: writeComment
    });
    if (res.status === 200) {
      setCommentList(prev => [...prev]); // TODO: make backend api response consistent so i can update this list here
      setWriteComment("");
    }
    console.log(res);
  }

  useEffect(() => {
    async function getComments() {
      const res = await COMMON_URL.get(`/comment?id=${episode?.id}`);
      console.log("commentador", res.data.data);
      setCommentList(res.data.data);
    }
    if (episode?.id) {
      getComments();
    }
  }, [episode])

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
      <div className="space-y-4">
        {commentList.length > 0 ? (
          commentList.map((comment, index) => (
            <div
              key={index}
              className="bg-[#2d2a3a]/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-sm"
            >
              <div className="grid grid-cols-[48px_1fr] gap-4">
                {/* Profile Picture */}
                <img
                  src={comment.user.profilePicture || "/vite.svg"}
                  alt={`${comment.user.username}'s profile`}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* Username, Date & Content */}
                <div className="grid grid-rows-[auto_1fr] gap-1">
                  {/* Username & Date */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="font-semibold text-rose-200">{comment.user.username}</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Comment Content */}
                  <p className="text-sm text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>



    </div>
  </>
}

export default Comment;
