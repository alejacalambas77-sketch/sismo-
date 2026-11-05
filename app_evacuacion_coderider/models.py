from django.db import models

class EvacuacionRegistro(models.Model):
    # Agregamos verbose_name a cada campo para corregir las tildes
    titulo = models.CharField(max_length=100, verbose_name="Título")
    descripcion = models.TextField(verbose_name="Descripción")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        # Configuración para que el panel de administración muestre los nombres con tildes y en plural/singular correcto
        verbose_name = "Registro de evacuación"
        verbose_name_plural = "Registros de evacuación"

    def __str__(self):
        return self.titulo