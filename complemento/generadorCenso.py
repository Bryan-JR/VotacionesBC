import random
import csv

# Datos de ejemplo para generar el censo
nombres = ["Juan", "Maria", "Pedro", "Luisa", "Andres", "Sebastian", "Brayan", "Anuar", "Daniel", "Duvan", "Teofilo", "Miguel", "Mariana", "Daniela", "Andrea", "Laura", "Monica", "Valentina", "Vanessa", "Luz", "Kate", "Johan", "Fabian", "Elian", "Federico", "Roberto", "Juliana", "Alberto", "Gustavo", "Shakira", "Fernando", "Aura", "Jenifer", "Orlando", "Jose"]
apellidos = ["Garcia", "Lopez", "Perez", "Rodriguez", "Martinez", "Jimenez", "Alvarez", "Herazo", "Gonzales", "Gomez", "Hoyos", "Ruiz", "Carvajal", "Otero", "Cordero", "Sierra", "Padilla", "Bedoya", "Quiroga", "Mozo", "Fabra", "Dueñas", "Peña", "Vega", "Pineda", "Cortez", "Negrete", "Acuña", "Berrio", "Posada", "Agamez", "Santos", "Petro", "Mesa", "Mendoza"]
tipos_documento = ["TI", "CC", "CC", "CC", "CC", "CC", "CC", "CC", "CC", "CC"]
facultades = ["Facultad de Ingeniería", "Facultad de Medicina Veterinaria y Zootecnia", "Facultad de Ciencias Agrícolas", "Facultad Ciencias Básicas", "Facultad de Educación y Ciencias Humanas", "Facultad Ciencias Económicas, jurídicas y Administrativas", "Facultad Ciencias de la Salud"]
programasIng = ["Ingeniería Ambiental", "Ingeniería de Alimentos", "Ingeniería Industrial", "Ingeniería Mecánica", "Ingeniería de Sistemas"]
programasAgro = ["Acuicultura", "Ingenierpía Agronómica"]
programasBas = ["Estadística", "Matemáticas", "Geografía", "Física", "Química", "Biología"]
programasEdu = ["Ciencias Naturales y Educación Ambiental", "Ciencias Sociales", "Educación Artística", "Educación Física, Recreación y Deporte", "Educación Infantil", "Informática", "Lenguas Extranjeras con Énfasis en Inglés", "Literatura y Lengua Castellana"]
programasEcoJu= ["Derecho", "Administración en Finanzas y Negocios Internacionales"]
programasSalud = ["Administración en Salud", "Bacteriología", "Enfermería", "Regencia de Farmacia"]
sanciones = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 4]
iniNum = ["300", "301", "302", "303", "304", "305", "310", "311", "312", "313", "314", "315", "320", "321", "322", "323", "324"]

# Generar el censo
censo = []
for i in range(250):  # Generar 100 registros
    nombre = random.choice(nombres)
    apellido1 = random.choice(apellidos)
    apellido2 = random.choice(apellidos)
    tipo_documento = random.choice(tipos_documento)
    identificacion = str(random.randint(100000000, 999999999))
    contraseña = f"{nombre[0]}{apellido1[0].lower()}.{identificacion}"
    numeroC = f"{random.choice(iniNum)} {random.randint(100, 999)} {random.randint(1000, 9999)}"
    facultad = random.choice(facultades)
    iFac = facultades.index(facultad)
    if iFac == 0:
        programa = random.choice(programasIng)
    elif iFac == 1:
        programa = "Medicina Veterinaria y Zootecnia"
    elif iFac == 2:
        programa = random.choice(programasAgro)
    elif iFac == 3:
        programa = random.choice(programasBas)
    elif iFac == 4:
        programa = random.choice(programasEdu)
    elif iFac == 5:
        programa = random.choice(programasEcoJu)
    elif iFac == 6:
        programa = random.choice(programasSalud)
    
    semestre = random.randint(1, 10)
    codigo_pwc = f"000-{random.randint(100, 999)}-{random.randint(100, 999)}"
    creditos_plan_academico = random.randint(100, 290)
    sancion = random.choice(sanciones)
    nota_pga = round(random.uniform(3, 5), 1)
    total_creditos_periodo = random.randint(15, 21)
    creditos_aprovados = random.randint(total_creditos_periodo, creditos_plan_academico)
    creditos_obtenidos_periodo = random.choice([total_creditos_periodo, random.randint(8, total_creditos_periodo)])
    
    censo.append([
        identificacion, nombre, apellido1, apellido2, tipo_documento, numeroC, contraseña, facultad, programa, semestre,
        nota_pga, codigo_pwc, creditos_plan_academico, creditos_aprovados, total_creditos_periodo, creditos_obtenidos_periodo,
        sancion
    ])

# Guardar el censo en un archivo CSV
with open('censoGen.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file, delimiter=';')
    writer.writerow([
        "identificacion", "nombre", "apellido1", "apellido2", "tipo_documento", "numero_celular", "contraseña", "facultad", "programa", "sem",
        "nota_pga", "codigopwc", "creditos_planAc", "total_creditos_apro", "creditos_periodo",
        "creditos_apro_periodo", "sanciones"
    ])
    writer.writerows(censo)

print("El censo ha sido generado y guardado en censo.csv.")
