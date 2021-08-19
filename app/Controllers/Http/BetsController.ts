import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Game from "App/Models/Game";
import Bet from "App/Models/Bet";
import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";

export default class BetsController {
  public async index({}: HttpContextContract) {
    const bets = await Bet.query().select("*");

    return bets;
  }

  public async create({ request }: HttpContextContract) {
    const { numbers, game_type, email } = request.all();

    const game = await Game.findByOrFail("game_type", game_type);

    const user = await User.findByOrFail("email", email);

    const chosen_numbers = numbers.join(", ");

    const bet = await Bet.create({
      game: game_type,
      chosen_numbers,
      price: game.price,
      date: new Date(),
    });

    await Mail.send((message) => {
      message
        .to(user.email)
        .from("pedrohenriquededeus@hotmail.com", "Pedro | Luby")
        .subject("Created new bet")
        .htmlView("emails/new_bet", {
          username: user.username,
          game: bet.game,
          numbers: chosen_numbers,
          price: bet.price,
          date: bet.date,
        });
    });

    return bet;
  }

  public async update({}: HttpContextContract) {}

  public async delete({ request }: HttpContextContract) {
    const { betId } = request.params();

    const bet = await Bet.findByOrFail("id", betId);

    bet.delete();

    return "Bet Deleted";
  }
}
