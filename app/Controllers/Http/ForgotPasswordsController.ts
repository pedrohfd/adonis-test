import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { v4 as uuidv4 } from "uuid";

import User from "App/Models/User";
import Mail from "@ioc:Adonis/Addons/Mail";

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const { email } = request.all();

      const user = await User.findByOrFail("email", email);

      user.token = uuidv4();
      user.token_created_at = new Date();

      await user.save();

      await Mail.send((message) => {
        message
          .to(user.email)
          .from("pedrohenriquededeus@hotmail.com", "Pedro | Luby")
          .subject("Reset password")
          .htmlView("emails/forgot_password", {
            email: user.email,
            username: user.username,
            token: user.token,
            link: `${request.input("redirect_url")}?token=${user.token}`,
          });
      });

      return user;
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "Algo não deu certo, esse email existe?" } });
    }
  }
}
