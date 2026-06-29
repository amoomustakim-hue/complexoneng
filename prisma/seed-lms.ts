import { PrismaClient } from "@prisma/client";

type LessonSeed = string;
type ModuleSeed = { title: string; lessons: LessonSeed[] };
type CourseSeed = {
  levelTag: string;
  order: number;
  title: string;
  description: string;
  modules: ModuleSeed[];
};

export const mathCourses: CourseSeed[] = [
  {
    levelTag: "SS1",
    order: 1,
    title: "SS1 Mathematics",
    description: "Foundational mathematics for Senior Secondary 1, aligned with the WAEC/NECO syllabus.",
    modules: [
      {
        title: "Number and Numeration",
        lessons: ["Number bases", "Modular arithmetic", "Fractions, decimals and approximations", "Indices and surds"],
      },
      {
        title: "Algebraic Processes",
        lessons: ["Simple equations", "Simultaneous linear equations", "Introduction to quadratic equations", "Algebraic fractions"],
      },
      {
        title: "Geometry",
        lessons: ["Angles and parallel lines", "Polygons", "Introduction to circle theorems", "Geometric construction"],
      },
      {
        title: "Mensuration",
        lessons: ["Perimeter and area of plane shapes", "Volume and surface area of solids"],
      },
      {
        title: "Statistics I",
        lessons: ["Data presentation: tables, bar charts, pie charts", "Measures of central tendency"],
      },
    ],
  },
  {
    levelTag: "SS2",
    order: 2,
    title: "SS2 Mathematics",
    description: "Senior Secondary 2 mathematics, building on SS1 with algebra, geometry, and trigonometry.",
    modules: [
      {
        title: "Algebraic Processes II",
        lessons: ["Quadratic equations", "Simultaneous linear and quadratic equations", "Variation", "Sequences and series"],
      },
      {
        title: "Geometry II",
        lessons: ["Circle theorems", "Bearings and distances", "Loci"],
      },
      {
        title: "Trigonometry",
        lessons: ["Trigonometric ratios", "Sine and cosine rules", "Trigonometric graphs"],
      },
      {
        title: "Statistics II",
        lessons: ["Probability: basic concepts", "Permutation and combination"],
      },
      {
        title: "Logical Reasoning",
        lessons: ["Sets and set operations", "Logic and reasoning", "Linear inequalities"],
      },
    ],
  },
  {
    levelTag: "SS3",
    order: 3,
    title: "SS3 / JAMB Mathematics",
    description: "SS3 mathematics with a JAMB/UTME exam-prep focus, covering the full secondary curriculum.",
    modules: [
      {
        title: "Further Calculus",
        lessons: ["Differentiation", "Integration", "Applications of calculus"],
      },
      {
        title: "Coordinate Geometry",
        lessons: ["Equation of a straight line", "Equation of a circle", "Introduction to conics"],
      },
      {
        title: "Vectors and Matrices",
        lessons: ["Vector algebra", "Matrices and determinants", "Matrix operations"],
      },
      {
        title: "Further Statistics and Probability",
        lessons: ["Probability distributions", "Correlation and regression basics"],
      },
      {
        title: "JAMB Exam Strategy",
        lessons: ["Common JAMB question patterns", "Time management techniques", "Avoiding common mistakes"],
      },
    ],
  },
  {
    levelTag: "100L",
    order: 4,
    title: "MTH101: Elementary Mathematics I",
    description: "First-year university mathematics: sets, logic, real numbers, functions, and trigonometry.",
    modules: [
      { title: "Set Theory and Logic", lessons: ["Sets and operations on sets", "Propositional logic"] },
      { title: "Real Number System", lessons: ["Properties of real numbers", "Inequalities"] },
      { title: "Functions and Mappings", lessons: ["Types of functions", "Composite and inverse functions"] },
      { title: "Trigonometric Functions", lessons: ["Trigonometric identities", "Trigonometric equations"] },
      { title: "Complex Numbers", lessons: ["Introduction to complex numbers", "Argand diagrams"] },
    ],
  },
  {
    levelTag: "100L",
    order: 4,
    title: "MTH102: Elementary Mathematics II",
    description: "Continuation of MTH101: differentiation, integration, sequences, vectors, and matrices.",
    modules: [
      { title: "Differentiation", lessons: ["Rules of differentiation", "Applications of derivatives"] },
      { title: "Integration", lessons: ["Techniques of integration", "Definite integrals and applications"] },
      { title: "Sequences and Series", lessons: ["Arithmetic and geometric progressions", "Convergence of series"] },
      { title: "Vectors", lessons: ["Vector algebra in 3D", "Scalar and vector products"] },
      { title: "Matrices and Determinants", lessons: ["Matrix operations", "Solving systems with matrices"] },
    ],
  },
  {
    levelTag: "200L",
    order: 5,
    title: "MTH201: Mathematical Methods I",
    description: "Second-year mathematics: partial differentiation, multiple integrals, and ODEs.",
    modules: [
      { title: "Partial Differentiation", lessons: ["Partial derivatives", "Chain rule for several variables"] },
      { title: "Multiple Integrals", lessons: ["Double integrals", "Applications of multiple integrals"] },
      { title: "Ordinary Differential Equations I", lessons: ["First-order ODEs", "Second-order linear ODEs"] },
      { title: "Infinite Series", lessons: ["Power series", "Taylor and Maclaurin series"] },
    ],
  },
  {
    levelTag: "200L",
    order: 5,
    title: "MTH202: Linear Algebra",
    description: "Vector spaces, linear transformations, and matrix theory.",
    modules: [
      { title: "Vector Spaces", lessons: ["Subspaces and basis", "Linear independence"] },
      { title: "Linear Transformations", lessons: ["Kernel and image", "Matrix representation"] },
      { title: "Matrices and Systems of Equations", lessons: ["Gaussian elimination", "Rank of a matrix"] },
      { title: "Eigenvalues and Eigenvectors", lessons: ["Characteristic equations", "Diagonalization"] },
    ],
  },
  {
    levelTag: "300L",
    order: 6,
    title: "MTH301: Real Analysis",
    description: "Rigorous treatment of limits, continuity, differentiability, and integration.",
    modules: [
      { title: "Sequences and Limits", lessons: ["Convergence of sequences", "Cauchy sequences"] },
      { title: "Continuity", lessons: ["Continuous functions", "Uniform continuity"] },
      { title: "Differentiability", lessons: ["Mean value theorem", "Taylor's theorem"] },
      { title: "Riemann Integration", lessons: ["Riemann sums", "Fundamental theorem of calculus"] },
    ],
  },
  {
    levelTag: "300L",
    order: 6,
    title: "MTH302: Abstract Algebra",
    description: "Groups, rings, fields, and homomorphisms.",
    modules: [
      { title: "Groups", lessons: ["Group axioms and examples", "Subgroups and cosets"] },
      { title: "Rings", lessons: ["Ring axioms", "Ideals and quotient rings"] },
      { title: "Fields", lessons: ["Field extensions", "Finite fields"] },
      { title: "Homomorphisms", lessons: ["Group and ring homomorphisms", "Isomorphism theorems"] },
    ],
  },
  {
    levelTag: "400L",
    order: 7,
    title: "MTH401: Complex Analysis",
    description: "Analytic functions, complex integration, and residue theory.",
    modules: [
      { title: "Analytic Functions", lessons: ["Cauchy-Riemann equations", "Harmonic functions"] },
      { title: "Complex Integration", lessons: ["Cauchy's theorem", "Cauchy's integral formula"] },
      { title: "Power Series", lessons: ["Taylor series in the complex plane", "Laurent series"] },
      { title: "Residues and Poles", lessons: ["Classification of singularities", "Residue theorem and applications"] },
    ],
  },
  {
    levelTag: "400L",
    order: 7,
    title: "MTH402: Numerical Analysis",
    description: "Numerical methods for solving equations, interpolation, and differential equations.",
    modules: [
      { title: "Numerical Solutions of Equations", lessons: ["Bisection and Newton-Raphson methods", "Fixed-point iteration"] },
      { title: "Interpolation", lessons: ["Lagrange interpolation", "Newton's divided differences"] },
      { title: "Numerical Differentiation and Integration", lessons: ["Finite difference methods", "Trapezoidal and Simpson's rule"] },
      { title: "Numerical Solutions of ODEs", lessons: ["Euler's method", "Runge-Kutta methods"] },
    ],
  },
];

export async function seedLms(prisma: PrismaClient) {
  console.log("Seeding Mathematics curriculum (SS1 - 400L)...");

  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  let courseCount = 0;
  let lessonCount = 0;

  for (const courseSeed of mathCourses) {
    const course = await prisma.course.create({
      data: {
        subject: "Mathematics",
        title: courseSeed.title,
        levelTag: courseSeed.levelTag,
        description: courseSeed.description,
        order: courseSeed.order,
      },
    });
    courseCount++;

    for (let mIndex = 0; mIndex < courseSeed.modules.length; mIndex++) {
      const moduleSeed = courseSeed.modules[mIndex];
      const module_ = await prisma.module.create({
        data: { courseId: course.id, title: moduleSeed.title, order: mIndex },
      });

      for (let lIndex = 0; lIndex < moduleSeed.lessons.length; lIndex++) {
        const lessonTitle = moduleSeed.lessons[lIndex];
        await prisma.lesson.create({
          data: {
            moduleId: module_.id,
            title: lessonTitle,
            order: lIndex,
            contentType: "TEXT",
            textContent: `This lesson covers "${lessonTitle}" as part of the ${moduleSeed.title} module in ${courseSeed.title}. Full notes and video walkthroughs will be added by your instructor soon — for now, use this as a study checklist alongside your AI coach.`,
            videoUrl: null,
          },
        });
        lessonCount++;
      }
    }
  }

  console.log(`Seeded ${courseCount} courses with ${lessonCount} lessons.`);
}
