import BalanceRequest from "../models/balanceRequest.model.js";
import StatusBalance from "../models/statusBalance.js";

export const getByClientId = async (req, res) => {
const idConfirm = req.user.clientId
const id = req.params.id

if (id !== String(idConfirm)) {
    return res.status(403).json({ message: "Forbidden. Client ID does not match." });
  }
try {
    const requests = await BalanceRequest.findAll({where: {
        client_id: id
    },
    include: [{
        model: StatusBalance,
        attributes: ['status'] // Incluye los atributos que necesites
      }]})

    res.status(200).json(requests)
} catch (error) {
    res.status(500).json(error)
    console.log(error)
}

}