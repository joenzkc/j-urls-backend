import UserService from "../../services/user.service";
import { EntityManager, Repository } from "typeorm";
import { config } from "dotenv";
import { User } from "src/entities/user.entity";
import { compare, hash } from "bcrypt";

describe("UserService", () => {
  let userService: UserService;
  let manager: jest.Mocked<EntityManager>;

  beforeAll(() => {
    const result = config();
    if (result.error) {
      throw result.error;
    }
  });

  beforeEach(() => {
    jest.resetAllMocks();
    manager = {
      getRepository: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    userService = new UserService();
  });

  it("should create user", async () => {
    const dto = {
      username: "test",
      password: "test",
    };

    const userRepo: jest.Mocked<Repository<User>> = {
      create: jest.fn().mockReturnValue(dto),
      save: jest.fn().mockReturnValue(dto),
    } as unknown as jest.Mocked<Repository<User>>;
    manager.getRepository.mockReturnValue(userRepo);
    const result = await userService.createUser(
      dto.username,
      dto.password,
      manager
    );
    expect(result.username).toEqual(dto.username);
    expect(compare(dto.password, result.password)).toBeTruthy();
  });

  it("should get user by id", async () => {
    const dto = {
      username: "test",
      password: "test",
    };

    const userRepo: jest.Mocked<Repository<User>> = {
      findOneOrFail: jest.fn().mockReturnValue(dto),
    } as unknown as jest.Mocked<Repository<User>>;
    manager.getRepository.mockReturnValue(userRepo);
    const result = await userService.getUserById("1", manager);
    expect(result.username).toEqual(dto.username);
    expect(result.password).toEqual(dto.password);
  });

  it("should get users urls", async () => {
    const dto = {
      username: "test",
      password: "test",
      urls: [
        {
          id: "1",
          url: "https://www.google.com",
          isActive: true,
          userId: "1",
        },
        {
          id: "2",
          url: "https://www.google.com",
          isActive: true,
          userId: "1",
        },
        {
          id: "3",
          url: "https://www.google.com",
          isActive: false,
          userId: "1",
        },
      ],
    };

    const userRepo: jest.Mocked<Repository<User>> = {
      findOneOrFail: jest.fn().mockReturnValue(dto),
    } as unknown as jest.Mocked<Repository<User>>;
    manager.getRepository.mockReturnValue(userRepo);
    const result = await userService.getUsersUrls("1", manager);
    expect(result.length).toEqual(2);
  });
});
