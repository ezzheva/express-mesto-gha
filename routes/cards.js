const router = require('express').Router();
const {
  validateCreateCards, validateDeleteCard, validateLikeCard, validateDislikeCard,
} = require('../middlewares/validation');
const {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCards, createCards);
router.delete('/:cardId', validateDeleteCard, deleteCard);
router.put('/:cardId/likes', validateLikeCard, likeCard);
router.delete('/:cardId/likes', validateDislikeCard, dislikeCard);

module.exports = router;
