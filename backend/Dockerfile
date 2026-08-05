# Multi-stage build: compile on the SDK image, run on the slim ASP.NET runtime.
# Build from the repository root: docker build -f backend/Dockerfile -t inventory-api .
# The 8.0 tags track the latest .NET 8 patch release; pin a specific tag
# (e.g. 8.0.4xx) for fully reproducible builds.

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore first so layer caching is effective when dependencies change.
COPY backend/backend.csproj .
RUN dotnet restore backend.csproj

COPY backend/ .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Cloud platforms terminate TLS at their edge and route HTTP to the app,
# so listen on a plain HTTP port. Override ASPNETCORE_URLS if needed.
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]
