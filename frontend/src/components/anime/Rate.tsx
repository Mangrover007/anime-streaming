import { useState } from "react";

const Rate = ({ starCount = 5, animeRating }: { starCount: number, animeRating: number }) => {

    const [rating, setRating] = useState<number>(animeRating);
    const [hoverRating, setHoverRating] = useState<number>(0);

    return <div className="flex gap-2">
        {new Array(starCount).fill(0).map((_, index) => {
            return <span
                key={index}
                className={(hoverRating === 0 && index < rating) || (index < hoverRating) ? "cursor-pointer gold" : "cursor-pointer"}
                onMouseEnter={() => setHoverRating(index + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(hoverRating)}
            >
                X
            </span>
        })}
    </div>
}

export default Rate;
