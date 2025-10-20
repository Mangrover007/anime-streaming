import { useContext, useState } from "react";
import type { CommentType } from "../../types";
import { PORTAL } from "../../App";
import { ADMIN_URL, PROT_URL } from "../../api";

type CommentCardProps = {
  comment: CommentType,
  setCommentList: React.Dispatch<React.SetStateAction<CommentType[]>>
}

const CommentCard = ({ comment, setCommentList }: CommentCardProps) => {

  const { isAdmin, user } = useContext(PORTAL);
  const [editedContent, setEditedContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  function handleEditComment(comment: CommentType) {
    setEditedContent(comment.content);
    setIsEditing(true);
  }

  async function saveEditComment(id: number) {
    const res = await PROT_URL.patch(`/comment?id=${id}`, {
      content: editedContent
    });
    if (res.status == 200) {
      setCommentList(prev => {
        return prev.map(comment => {
          if (comment.id === id) {
            return {
              ...comment, content: editedContent
            };
          }
          return comment;
        });
      })
      setEditedContent("");
      setIsEditing(false);
    }
  }

  async function deleteComment(id: number) {
    if (isAdmin) {
      const res = await ADMIN_URL.delete(`/comment?id=${id}`)
      if (res.status === 200) {
        setCommentList(prev => prev.filter(comment => comment.id !== id))
      }
    }
    else if (user) {
      const res = await PROT_URL.delete(`/comment?id=${id}`)
      if (res.status === 200) {
        setCommentList(prev => prev.filter(comment => comment.id !== id))
      }
    }
  }

  return <>
    <div
      key={comment.id}
      className="relative bg-[#2d2a3a]/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 overflow-x-scroll"
    >
      {/* Delete Button (Top-Right Corner) */}
      {((comment.user.id === user?.id) || isAdmin) && (
        <button
          onClick={() => deleteComment(comment.id)}
          className="absolute top-2 right-2 text-xs text-gray-400 hover:text-red-400"
        >
          Delete
        </button>
      )}

      {/* Edit & Save Buttons */}
      {(comment.user.id === user?.id) && (
        <div className="absolute top-2 right-20 flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => handleEditComment(comment)}
              className="text-xs text-gray-400 hover:text-blue-400"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => saveEditComment(comment.id)}
                className="text-xs text-gray-400 hover:text-green-400"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditedContent("");
                  setIsEditing(false);
                }}
                className="text-xs text-gray-400 hover:text-yellow-400"
              >
                Cancel
              </button>
            </>

          )}
        </div>
      )}

      <div className="grid grid-cols-[48px_1fr] gap-4 items-center">
        {/* Profile Picture */}
        <img
          src={comment.user.profilePicture || "/vite.svg"}
          alt={`${comment.user.username}'s profile`}
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Username, Date & Content */}
        <div className="flex flex-col">
          {/* Username */}
          <span className="font-semibold text-rose-200 text-sm mb-1">
            {comment.user.username}
          </span>

          {/* Date */}
          <span className="text-xs text-gray-500 mb-3">
            {new Date(comment.createdAt).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* Comment Content */}
          <p
            className={`text-sm text-gray-300 ${isEditing ? "outline-none border border-pink-400 px-2 py-1 rounded bg-[#1e1b2e]" : ""
              }`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => setEditedContent(e.currentTarget.textContent || "")}
          >
            {isEditing ? editedContent : comment.content}
          </p>
        </div>
      </div>
    </div>
  </>
}

export default CommentCard;
