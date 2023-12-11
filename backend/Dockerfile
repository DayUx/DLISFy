FROM python:3.11-alpine

# Définissez le répertoire de travail
WORKDIR /app

# Copiez les fichiers de dépendances Python (requirements.txt) dans le répertoire de travail
COPY requirements.txt .

# Installez les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt
RUN echo $(pwd)

# Copiez le reste de l'application dans le répertoire de travail
COPY . .


ENV PYTHONPATH "${PYTHONPATH}:/app"

# Exposez le port sur lequel l'application sera accessible
EXPOSE 443

# Démarrez l'application avec uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "443"]