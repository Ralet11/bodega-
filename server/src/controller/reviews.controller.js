import Review from "../models/reviews.model.js";
import Local from "../models/local.js";

export const createReview = async (req, res) => {
    try {
        const { message, rating, order_id, local_id } = req.body; // Asegúrate de recibir el local_id en el body
        const user_id = req.user.userId;

        console.log(req.body);

        // Crear la nueva review
        const newReview = await Review.create({
            message,
            rating,
            order_id,
            user_id,
            local_id
        });

        // Buscar el local correspondiente
        const local = await Local.findByPk(local_id);

        if (!local) {
            return res.status(404).json({ message: 'Local not found' });
        }

        // Asegurarse de que ratingSum y ratingCount no sean undefined
        const currentRatingSum = local.ratingSum || 0;
        const currentRatingCount = local.ratingCount || 0;

        // Actualizar la suma de calificaciones y el conteo
        const newRatingSum = currentRatingSum + rating;
        const newRatingCount = currentRatingCount + 1;

        // Calcular el nuevo promedio
        const newRating = newRatingSum / newRatingCount;

        // Actualizar el local con los nuevos valores de rating
        await local.update({ rating: newRating, ratingSum: newRatingSum, ratingCount: newRatingCount });

        // Devolver la review creada y el nuevo rating del local
        res.status(200).json({
            message: 'Review created and rating updated successfully',
            newReview,
            newRating
        });
    } catch (error) {
        console.error('Error creating review and updating rating:', error);
        res.status(500).json({ error: true, message: error.message });
    }
};

export const getAllReviewsByLocal = async (req, res) => {
    try {
        const { local_id } = req.params;

        // Buscar todas las reviews del local
        const reviews = await Review.findAll({
            where: { local_id },
            include: [
                { association: 'user', attributes: ['id', 'name', 'email'] }
            ]
        });

        if (!reviews) {
            return res.status(404).json({ message: 'Reviews not found' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error getting reviews by local:', error);
        res.status(500).json({ error: true, message: error.message });
    }
}

export const getAllReviewsByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Buscar todas las reviews del local
        const reviews = await Review.findAll({
            where: { user_id },
        });

        if (!reviews) {
            return res.status(404).json({ message: 'Reviews not found' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error getting reviews by user:', error);
        res.status(500).json({ error: true, message: error.message });
    }
}


export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la review
        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Eliminar la review
        await review.destroy();

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: true, message: error.message });
    }
}