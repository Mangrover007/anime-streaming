import { Link } from "react-router-dom";

type AnimeCardProps = {
  imgUrl: string;
  title: string;
};

const AnimeCard = ({ imgUrl, title }: AnimeCardProps) => {
  return (
    <Link
      to={`/${title}`}
      className="w-full max-w-xs bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 block"
    >
      <img
        src={imgUrl}
        alt={title}
        className="w-full h-80 object-cover object-center"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {title}
        </h2>
      </div>
    </Link>
  );
};

export default AnimeCard;
