import { GraphQLResolveInfo } from "graphql";
import { gql } from "@apollo/client";
import * as ApolloReactCommon from "@apollo/client";
import * as ApolloReactHooks from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Coin = {
  id: Scalars["String"];
  image: Scalars["String"];
  name: Scalars["String"];
  symbol: Scalars["String"];
};

export type CoinInfo = {
  coins: Array<Coin>;
  supportedCurrencies: Array<Scalars["String"]>;
};

export type CryptoPair = {
  coinId: Scalars["String"];
  vsCurrency: Scalars["String"];
};

export type Dashboard = {
  id: Scalars["String"];
  pairs: Array<CryptoPair>;
  title: Scalars["String"];
};

export type Mutation = {
  addCryptoPair: Dashboard;
  createDashboard: Dashboard;
  deleteDashboard?: Maybe<SuccessResponse>;
};

export type MutationAddCryptoPairArgs = {
  coinId: Scalars["String"];
  dashboardId: Scalars["ID"];
  vsCurrency: Scalars["String"];
};

export type MutationCreateDashboardArgs = {
  title: Scalars["String"];
};

export type MutationDeleteDashboardArgs = {
  id: Scalars["ID"];
};

export type PricePair = {
  coinId: Scalars["String"];
  price: Scalars["Float"];
  vsCurrency: Scalars["String"];
};

export type Query = {
  coinInfo: CoinInfo;
  dashboard?: Maybe<Dashboard>;
  dashboards: Array<Dashboard>;
  prices: Array<PricePair>;
};

export type QueryDashboardArgs = {
  id: Scalars["ID"];
};

export type QueryPricesArgs = {
  ids: Array<Scalars["String"]>;
  vsCurrencies: Array<Scalars["String"]>;
};

export type SuccessResponse = {
  success?: Maybe<Scalars["Boolean"]>;
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Coin: ResolverTypeWrapper<Coin>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  CoinInfo: ResolverTypeWrapper<CoinInfo>;
  CryptoPair: ResolverTypeWrapper<CryptoPair>;
  Dashboard: ResolverTypeWrapper<Dashboard>;
  Mutation: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  PricePair: ResolverTypeWrapper<PricePair>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Query: ResolverTypeWrapper<{}>;
  SuccessResponse: ResolverTypeWrapper<SuccessResponse>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Coin: Coin;
  String: Scalars["String"];
  CoinInfo: CoinInfo;
  CryptoPair: CryptoPair;
  Dashboard: Dashboard;
  Mutation: {};
  ID: Scalars["ID"];
  PricePair: PricePair;
  Float: Scalars["Float"];
  Query: {};
  SuccessResponse: SuccessResponse;
  Boolean: Scalars["Boolean"];
  AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars["String"]>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = UnionDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars["String"];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = AbstractEntityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars["Boolean"]>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = EntityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars["String"]>;
};

export type ColumnDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = ColumnDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {};

export type IdDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = IdDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars["String"]>;
};

export type LinkDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = LinkDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = {};

export type EmbeddedDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = EmbeddedDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars["String"];
};

export type MapDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = MapDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CoinResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Coin"] = ResolversParentTypes["Coin"]
> = {
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  image?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoinInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["CoinInfo"] = ResolversParentTypes["CoinInfo"]
> = {
  coins?: Resolver<Array<ResolversTypes["Coin"]>, ParentType, ContextType>;
  supportedCurrencies?: Resolver<
    Array<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CryptoPairResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["CryptoPair"] = ResolversParentTypes["CryptoPair"]
> = {
  coinId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  vsCurrency?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DashboardResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Dashboard"] = ResolversParentTypes["Dashboard"]
> = {
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  pairs?: Resolver<
    Array<ResolversTypes["CryptoPair"]>,
    ParentType,
    ContextType
  >;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  addCryptoPair?: Resolver<
    ResolversTypes["Dashboard"],
    ParentType,
    ContextType,
    RequireFields<
      MutationAddCryptoPairArgs,
      "coinId" | "dashboardId" | "vsCurrency"
    >
  >;
  createDashboard?: Resolver<
    ResolversTypes["Dashboard"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateDashboardArgs, "title">
  >;
  deleteDashboard?: Resolver<
    Maybe<ResolversTypes["SuccessResponse"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteDashboardArgs, "id">
  >;
};

export type PricePairResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["PricePair"] = ResolversParentTypes["PricePair"]
> = {
  coinId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  price?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  vsCurrency?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  coinInfo?: Resolver<ResolversTypes["CoinInfo"], ParentType, ContextType>;
  dashboard?: Resolver<
    Maybe<ResolversTypes["Dashboard"]>,
    ParentType,
    ContextType,
    RequireFields<QueryDashboardArgs, "id">
  >;
  dashboards?: Resolver<
    Array<ResolversTypes["Dashboard"]>,
    ParentType,
    ContextType
  >;
  prices?: Resolver<
    Array<ResolversTypes["PricePair"]>,
    ParentType,
    ContextType,
    RequireFields<QueryPricesArgs, "ids" | "vsCurrencies">
  >;
};

export type SuccessResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["SuccessResponse"] = ResolversParentTypes["SuccessResponse"]
> = {
  success?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Coin?: CoinResolvers<ContextType>;
  CoinInfo?: CoinInfoResolvers<ContextType>;
  CryptoPair?: CryptoPairResolvers<ContextType>;
  Dashboard?: DashboardResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PricePair?: PricePairResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SuccessResponse?: SuccessResponseResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
};

export type DashboardFragmentFragment = {
  id: string;
  title: string;
  pairs: Array<{ coinId: string; vsCurrency: string }>;
};

export type CoinInfoQueryVariables = Exact<{ [key: string]: never }>;

export type CoinInfoQuery = {
  coinInfo: {
    supportedCurrencies: Array<string>;
    coins: Array<{ id: string; symbol: string; name: string; image: string }>;
  };
};

export type PricesQueryVariables = Exact<{
  ids: Array<Scalars["String"]> | Scalars["String"];
  vsCurrencies: Array<Scalars["String"]> | Scalars["String"];
}>;

export type PricesQuery = {
  prices: Array<{ coinId: string; vsCurrency: string; price: number }>;
};

export type DashboardsQueryVariables = Exact<{ [key: string]: never }>;

export type DashboardsQuery = {
  dashboards: Array<{
    id: string;
    title: string;
    pairs: Array<{ coinId: string; vsCurrency: string }>;
  }>;
};

export type DashboardByIdQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DashboardByIdQuery = {
  dashboard?: {
    id: string;
    title: string;
    pairs: Array<{ coinId: string; vsCurrency: string }>;
  } | null;
};

export type CreateDashboardMutationVariables = Exact<{
  title: Scalars["String"];
}>;

export type CreateDashboardMutation = {
  createDashboard: {
    id: string;
    title: string;
    pairs: Array<{ coinId: string; vsCurrency: string }>;
  };
};

export type DeleteDashboardMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteDashboardMutation = {
  deleteDashboard?: { success?: boolean | null } | null;
};

export type AddCryptoPairMutationVariables = Exact<{
  dashboardId: Scalars["ID"];
  coinId: Scalars["String"];
  vsCurrency: Scalars["String"];
}>;

export type AddCryptoPairMutation = {
  addCryptoPair: {
    id: string;
    title: string;
    pairs: Array<{ coinId: string; vsCurrency: string }>;
  };
};

export const DashboardFragmentFragmentDoc = gql`
  fragment DashboardFragment on Dashboard {
    id
    title
    pairs {
      coinId
      vsCurrency
    }
  }
`;
export const CoinInfoDocument = gql`
  query CoinInfo {
    coinInfo {
      coins {
        id
        symbol
        name
        image
      }
      supportedCurrencies
    }
  }
`;

/**
 * __useCoinInfoQuery__
 *
 * To run a query within a React component, call `useCoinInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCoinInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCoinInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useCoinInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CoinInfoQuery,
    CoinInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<CoinInfoQuery, CoinInfoQueryVariables>(
    CoinInfoDocument,
    options
  );
}
export function useCoinInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CoinInfoQuery,
    CoinInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<CoinInfoQuery, CoinInfoQueryVariables>(
    CoinInfoDocument,
    options
  );
}
export type CoinInfoQueryHookResult = ReturnType<typeof useCoinInfoQuery>;
export type CoinInfoLazyQueryHookResult = ReturnType<
  typeof useCoinInfoLazyQuery
>;
export type CoinInfoQueryResult = ApolloReactCommon.QueryResult<
  CoinInfoQuery,
  CoinInfoQueryVariables
>;
export const PricesDocument = gql`
  query Prices($ids: [String!]!, $vsCurrencies: [String!]!) {
    prices(ids: $ids, vsCurrencies: $vsCurrencies) {
      coinId
      vsCurrency
      price
    }
  }
`;

/**
 * __usePricesQuery__
 *
 * To run a query within a React component, call `usePricesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePricesQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *      vsCurrencies: // value for 'vsCurrencies'
 *   },
 * });
 */
export function usePricesQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    PricesQuery,
    PricesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<PricesQuery, PricesQueryVariables>(
    PricesDocument,
    options
  );
}
export function usePricesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    PricesQuery,
    PricesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<PricesQuery, PricesQueryVariables>(
    PricesDocument,
    options
  );
}
export type PricesQueryHookResult = ReturnType<typeof usePricesQuery>;
export type PricesLazyQueryHookResult = ReturnType<typeof usePricesLazyQuery>;
export type PricesQueryResult = ApolloReactCommon.QueryResult<
  PricesQuery,
  PricesQueryVariables
>;
export const DashboardsDocument = gql`
  query Dashboards {
    dashboards {
      ...DashboardFragment
    }
  }
  ${DashboardFragmentFragmentDoc}
`;

/**
 * __useDashboardsQuery__
 *
 * To run a query within a React component, call `useDashboardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDashboardsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    DashboardsQuery,
    DashboardsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<DashboardsQuery, DashboardsQueryVariables>(
    DashboardsDocument,
    options
  );
}
export function useDashboardsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DashboardsQuery,
    DashboardsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    DashboardsQuery,
    DashboardsQueryVariables
  >(DashboardsDocument, options);
}
export type DashboardsQueryHookResult = ReturnType<typeof useDashboardsQuery>;
export type DashboardsLazyQueryHookResult = ReturnType<
  typeof useDashboardsLazyQuery
>;
export type DashboardsQueryResult = ApolloReactCommon.QueryResult<
  DashboardsQuery,
  DashboardsQueryVariables
>;
export const DashboardByIdDocument = gql`
  query DashboardById($id: ID!) {
    dashboard(id: $id) {
      ...DashboardFragment
    }
  }
  ${DashboardFragmentFragmentDoc}
`;

/**
 * __useDashboardByIdQuery__
 *
 * To run a query within a React component, call `useDashboardByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDashboardByIdQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    DashboardByIdQuery,
    DashboardByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    DashboardByIdQuery,
    DashboardByIdQueryVariables
  >(DashboardByIdDocument, options);
}
export function useDashboardByIdLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DashboardByIdQuery,
    DashboardByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    DashboardByIdQuery,
    DashboardByIdQueryVariables
  >(DashboardByIdDocument, options);
}
export type DashboardByIdQueryHookResult = ReturnType<
  typeof useDashboardByIdQuery
>;
export type DashboardByIdLazyQueryHookResult = ReturnType<
  typeof useDashboardByIdLazyQuery
>;
export type DashboardByIdQueryResult = ApolloReactCommon.QueryResult<
  DashboardByIdQuery,
  DashboardByIdQueryVariables
>;
export const CreateDashboardDocument = gql`
  mutation CreateDashboard($title: String!) {
    createDashboard(title: $title) {
      ...DashboardFragment
    }
  }
  ${DashboardFragmentFragmentDoc}
`;
export type CreateDashboardMutationFn = ApolloReactCommon.MutationFunction<
  CreateDashboardMutation,
  CreateDashboardMutationVariables
>;

/**
 * __useCreateDashboardMutation__
 *
 * To run a mutation, you first call `useCreateDashboardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDashboardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDashboardMutation, { data, loading, error }] = useCreateDashboardMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateDashboardMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateDashboardMutation,
    CreateDashboardMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    CreateDashboardMutation,
    CreateDashboardMutationVariables
  >(CreateDashboardDocument, options);
}
export type CreateDashboardMutationHookResult = ReturnType<
  typeof useCreateDashboardMutation
>;
export type CreateDashboardMutationResult =
  ApolloReactCommon.MutationResult<CreateDashboardMutation>;
export type CreateDashboardMutationOptions =
  ApolloReactCommon.BaseMutationOptions<
    CreateDashboardMutation,
    CreateDashboardMutationVariables
  >;
export const DeleteDashboardDocument = gql`
  mutation DeleteDashboard($id: ID!) {
    deleteDashboard(id: $id) {
      success
    }
  }
`;
export type DeleteDashboardMutationFn = ApolloReactCommon.MutationFunction<
  DeleteDashboardMutation,
  DeleteDashboardMutationVariables
>;

/**
 * __useDeleteDashboardMutation__
 *
 * To run a mutation, you first call `useDeleteDashboardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDashboardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDashboardMutation, { data, loading, error }] = useDeleteDashboardMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteDashboardMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteDashboardMutation,
    DeleteDashboardMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    DeleteDashboardMutation,
    DeleteDashboardMutationVariables
  >(DeleteDashboardDocument, options);
}
export type DeleteDashboardMutationHookResult = ReturnType<
  typeof useDeleteDashboardMutation
>;
export type DeleteDashboardMutationResult =
  ApolloReactCommon.MutationResult<DeleteDashboardMutation>;
export type DeleteDashboardMutationOptions =
  ApolloReactCommon.BaseMutationOptions<
    DeleteDashboardMutation,
    DeleteDashboardMutationVariables
  >;
export const AddCryptoPairDocument = gql`
  mutation AddCryptoPair(
    $dashboardId: ID!
    $coinId: String!
    $vsCurrency: String!
  ) {
    addCryptoPair(
      dashboardId: $dashboardId
      coinId: $coinId
      vsCurrency: $vsCurrency
    ) {
      ...DashboardFragment
    }
  }
  ${DashboardFragmentFragmentDoc}
`;
export type AddCryptoPairMutationFn = ApolloReactCommon.MutationFunction<
  AddCryptoPairMutation,
  AddCryptoPairMutationVariables
>;

/**
 * __useAddCryptoPairMutation__
 *
 * To run a mutation, you first call `useAddCryptoPairMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCryptoPairMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCryptoPairMutation, { data, loading, error }] = useAddCryptoPairMutation({
 *   variables: {
 *      dashboardId: // value for 'dashboardId'
 *      coinId: // value for 'coinId'
 *      vsCurrency: // value for 'vsCurrency'
 *   },
 * });
 */
export function useAddCryptoPairMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddCryptoPairMutation,
    AddCryptoPairMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    AddCryptoPairMutation,
    AddCryptoPairMutationVariables
  >(AddCryptoPairDocument, options);
}
export type AddCryptoPairMutationHookResult = ReturnType<
  typeof useAddCryptoPairMutation
>;
export type AddCryptoPairMutationResult =
  ApolloReactCommon.MutationResult<AddCryptoPairMutation>;
export type AddCryptoPairMutationOptions =
  ApolloReactCommon.BaseMutationOptions<
    AddCryptoPairMutation,
    AddCryptoPairMutationVariables
  >;
import { ObjectId } from "mongodb";
export type DashboardDbObject = {
  _id: ObjectId;
  pairs: Array<CryptoPair>;
  title: string;
};
