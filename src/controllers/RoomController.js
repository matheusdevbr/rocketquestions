const Database = require("../db/config")

module.exports = {
    async create(req, res) {
        const db = await Database()
        const pass = req.body.password
        let roomId = ""
        let isRoom = true
        while (isRoom) {

            /* Gerando numero da sala */
            for (i = 0; i < 6; i++) {
                roomId += Math.floor(Math.random() * 10).toString()
            }

            /* Vericando se esse numero ja existe */
            const roomsExistIds = await db.all(`SELECT id FROM rooms`)
            isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)
            if (!isRoom) {

                await db.run(`INSERT INTO rooms (
                    id,
                    pass
                ) VALUES (
                    ${parseInt(roomId)},
                    ${pass}
                )`)
            }
        }
        await db.close()

        res.redirect(`/room/${roomId}`)
    },

    async open(req, res) {
        const db = await Database()
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = '${roomId}'`)
        
        res.render("room", {roomId: roomId, questions: questions})
    }
}