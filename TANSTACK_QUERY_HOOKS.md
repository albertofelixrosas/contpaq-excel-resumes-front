# TanStack Query Hooks Architecture

Esta estructura implementa un patrón organizacional consistente para TanStack Query (React Query) en el proyecto.

## 📁 Estructura de Carpetas

```
src/hooks/
├── concepts/
│   ├── useConcepts.ts           // GET - lista con filtros
│   ├── useCreateConcept.ts      // POST - crear
│   ├── useUpdateConcept.ts      // PUT - actualizar  
│   ├── useDeleteConcept.ts      // DELETE - eliminar
│   ├── useConcept.ts            // GET - por ID
│   └── index.ts                 // Exports centralizados
├── companies/
├── movements/
├── segments/
├── accounting-accounts/
└── config/
    └── queryClient.ts           // Configuración del QueryClient
```

## 🎯 Patrón de Naming

- **Queries (GET):** `use + Recurso + s` (plural) o `use + Recurso` (singular por ID)
- **Mutations:** `use + Verbo + Recurso` (crear, actualizar, eliminar)

## 📖 Uso de los Hooks

### Queries (Lectura de datos)

```typescript
// Lista de conceptos
const { data: concepts, isLoading, error } = useConcepts({ company_id: 1 });

// Concepto individual
const { data: concept, isLoading, error } = useConcept(conceptId);

// Lista de empresas
const { data: companies, isLoading, error } = useCompanies();

// Movimientos con filtros y paginación
const { data: movementsData, isLoading, error } = useMovements({
  company_id: 1,
  start_date: '2025-01-01',
  end_date: '2025-12-31',
  page: 1,
  limit: 10
});
```

### Mutations (Escritura de datos)

```typescript
// Crear concepto
const { createConcept, isPending, isError, error, isSuccess } = useCreateConcept();

const handleCreateConcept = () => {
  createConcept({
    company_id: 1,
    name: 'Nuevo Concepto'
  });
};

// Actualizar concepto
const { updateConcept, isPending, isError, error, isSuccess } = useUpdateConcept();

const handleUpdateConcept = () => {
  updateConcept({
    id: 1,
    data: { name: 'Concepto Actualizado' }
  });
};

// Eliminar concepto
const { deleteConcept, isPending, isError, error, isSuccess } = useDeleteConcept();

const handleDeleteConcept = () => {
  deleteConcept(conceptId);
};
```

## 🔧 Configuración del QueryClient

El QueryClient está configurado en `src/config/queryClient.ts` con las siguientes opciones por defecto:

- **staleTime:** 5 minutos
- **gcTime:** 10 minutos
- **retry:** Automático para errores 5xx, sin retry para 4xx
- **refetchOnWindowFocus:** Deshabilitado

## 📋 Recursos Disponibles

### Concepts
- `useConcepts(params)` - Lista de conceptos
- `useConcept(id)` - Concepto por ID
- `useCreateConcept()` - Crear concepto
- `useUpdateConcept()` - Actualizar concepto
- `useDeleteConcept()` - Eliminar concepto

### Companies
- `useCompanies()` - Lista de empresas
- `useCompany(id)` - Empresa por ID
- `useCreateCompany()` - Crear empresa
- `useUpdateCompany()` - Actualizar empresa
- `useDeleteCompany()` - Eliminar empresa

### Movements
- `useMovements(filters)` - Lista paginada de movimientos
- `useMovement(id)` - Movimiento por ID
- `useMovementsHeatmap(filters)` - Heatmap de movimientos
- `useMovementsSuppliers(filters)` - Proveedores de movimientos
- `useMovementsConcepts(filters)` - Conceptos de movimientos
- `useCreateMovement()` - Crear movimiento
- `useUpdateMovement()` - Actualizar movimiento
- `useDeleteMovement()` - Eliminar movimiento
- `useMasiveUpdateMovements()` - Actualización masiva

### Segments
- `useSegments(params)` - Lista de segmentos
- `useSegment(id)` - Segmento por ID
- `useCreateSegment()` - Crear segmento
- `useUpdateSegment()` - Actualizar segmento
- `useDeleteSegment()` - Eliminar segmento

### Accounting Accounts
- `useAccountingAccounts(params)` - Lista de cuentas contables
- `useAccountingAccount(id)` - Cuenta contable por ID
- `useCreateAccountingAccount()` - Crear cuenta contable
- `useUpdateAccountingAccount()` - Actualizar cuenta contable
- `useDeleteAccountingAccount()` - Eliminar cuenta contable

## 🔄 Invalidación de Cache

Los hooks de mutation incluyen invalidación automática de cache:

- Al crear: Invalida la lista del recurso
- Al actualizar: Invalida la lista y el item específico
- Al eliminar: Invalida la lista y remueve el item específico

## 📦 Importaciones

Puedes importar hooks individuales o usar los exports centralizados:

```typescript
// Importación individual
import { useConcepts } from '@/hooks/concepts/useConcepts';

// Importación desde index
import { useConcepts, useCreateConcept } from '@/hooks/concepts';
```

## ⚡ Ejemplo de Componente

```typescript
import React from 'react';
import { useConcepts, useCreateConcept, useDeleteConcept } from '@/hooks/concepts';

export function ConceptsManager({ companyId }: { companyId: number }) {
  const { data: concepts, isLoading, error } = useConcepts({ company_id: companyId });
  const { createConcept, isPending: isCreating } = useCreateConcept();
  const { deleteConcept, isPending: isDeleting } = useDeleteConcept();

  if (isLoading) return <div>Cargando conceptos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Conceptos</h2>
      <button 
        onClick={() => createConcept({ company_id: companyId, name: 'Nuevo Concepto' })}
        disabled={isCreating}
      >
        {isCreating ? 'Creando...' : 'Crear Concepto'}
      </button>
      
      <ul>
        {concepts?.map((concept) => (
          <li key={concept.concept_id}>
            {concept.name}
            <button 
              onClick={() => deleteConcept(concept.concept_id)}
              disabled={isDeleting}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```