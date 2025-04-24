import PropTypes from "prop-types";
import "tailwindcss/tailwind.css";

function Card({ imageSource, title, text, url, badge }) {
  return (
    <div className="relative bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
      {badge && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-br-xl">
          {badge}
        </div>
      )}
      <img src={imageSource} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h4 className="text-xl font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
          {text}
        </p>
        <a
          href={url || "#!"}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white rounded-full font-semibold transition-colors duration-300 hover:bg-blue-700"
        >
          See More
        </a>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  url: PropTypes.string,
  imageSource: PropTypes.string,
  badge: PropTypes.string,
};

export default Card;
