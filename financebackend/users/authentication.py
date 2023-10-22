from rest_framework.authentication import BaseAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed

class CookieTokenAuthentication(BaseAuthentication):

    def authenticate(self, request):
        auth_token = request.COOKIES.get('auth_token')
        if not auth_token:
            return None

        try:
            token = Token.objects.get(key=auth_token)
        except Token.DoesNotExist:
            return None

        return (token.user, token)