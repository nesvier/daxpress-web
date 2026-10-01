FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY src/Daxpress.Web/Daxpress.Web.csproj src/Daxpress.Web/
RUN dotnet restore src/Daxpress.Web/Daxpress.Web.csproj
COPY src/ src/
RUN dotnet publish src/Daxpress.Web/Daxpress.Web.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
# Render (y otros hosts) indican el puerto en $PORT; en local se usa 8080.
ENV ASPNETCORE_ENVIRONMENT=Production
CMD ASPNETCORE_HTTP_PORTS=${PORT:-8080} dotnet Daxpress.Web.dll
