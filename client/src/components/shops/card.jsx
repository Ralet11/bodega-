import PropTypes from "prop-types";
import "tailwindcss/tailwind.css";

function Card({ imageSource, title, text, url }) {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-4 md:mx-0 transform transition duration-300 hover:scale-105">
            <div className="relative">
                <img src={imageSource} alt={title} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4">
                <h4 className="text-xl font-semibold text-gray-900">{title}</h4>
                <p className="text-gray-700 mt-2">
                    {text
                        ? text
                        : "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam deserunt fuga accusantium excepturi quia, voluptates obcaecati nam in voluptas perferendis velit harum dignissimos quasi ex? Tempore repellat quo doloribus magnam."}
                </p>
                <a
                    href={url ? url : "#!"}
                    target="_blank"
                    className="mt-3 inline-block px-6 py-2 bg-blue-500 text-white rounded-full transition-transform transform hover:scale-105 duration-300"
                    rel="noreferrer"
                >
                    Go to {title}
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
};

export default Card;