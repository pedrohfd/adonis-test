import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Mail from "@ioc:Adonis/Addons/Mail";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import NewPasswordValidator from "App/Validators/NewPasswordValidator";

export default class UsersController {
  public async create({ request }: HttpContextContract) {
    const data = request.only(["username", "email", "password"]);
    await request.validate(CreateUserValidator);

    const user = await User.create(data);

    await Mail.send((message) => {
      message
        .to(user.email)
        .from("pedrohenriquededeus@hotmail.com", "Pedro | Luby")
        .subject("Welcome")
        .htmlView("emails/new_user", {
          username: user.username,
        });
    });

    return user;
  }

  // public async update({ request, auth }: HttpContextContract) {
  //   const { email, newPassword } = request.only(["email", "newPassword"]);

  //   const { id } = await auth.use("api").authenticate();

  //   console.log(id);

  //   // await request.validate(NewPasswordValidator);

  //   // const user = await User.find("email", email);

  //   // console.log(user);

  //   // user.password = newPassword;

  //   // await user.save();

  //   return user;
  // }

  public async delete({ auth }: HttpContextContract) {
    const { id } = await auth.use("api").authenticate();

    const user = await User.findByOrFail("id", id);

    await user.delete();

    return "User delete";
  }
}
