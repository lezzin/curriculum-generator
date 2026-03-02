import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser('id') -> retorna apenas o campo 'id' do usuário
 * @CurrentUser() -> retorna o objeto inteiro do usuário
 */
export const CurrentUser = createParamDecorator(
  (property: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return null;
    return property ? user[property] : user;
  },
);
