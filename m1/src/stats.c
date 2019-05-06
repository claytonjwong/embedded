/******************************************************************************
 * Copyright (C) 2017 by Alex Fosdick - University of Colorado
 *
 * Redistribution, modification or use of this software in source or binary
 * forms is permitted as long as the files maintain this copyright. Users are 
 * permitted to modify this and use it to learn about the field of embedded
 * software. Alex Fosdick and the University of Colorado are not liable for any
 * misuse of this material. 
 *
 *****************************************************************************/
/**
 * @file stats.c
 * @brief implementation file for this assignment
 *
 * @author Clayton Wong
 * @date 2019-05-06
 *
 */

#include <limits.h>
#include <stdlib.h>
#include <stdio.h>
#include "stats.h"

const int INF = INT_MAX;

void print_statistics( HType A, size_t N ){
    printf( "sorted: " );
    sort_array( A, N, compare );
    print_array( A, N );
    Type min = find_minimum( A, N ),
         max = find_maximum( A, N );
    double median = find_median( A, N ),
           mean   = find_mean( A, N );
    printf( "min:    %d\n", min );
    printf( "max:    %d\n", max );
    printf( "median: %.1lf\n", median );
    printf( "mean:   %.1lf\n", mean );
}

void print_array( HType A, size_t N ){
    if( ! A )
        return;
    for( int i=0; i < N; printf( "%d ", A[ i++ ] ) );
    printf( "\n" );
}

double find_median( HType A, size_t N ){
    if( ! A )
        return 0;
    sort_array( A, N, compare );
    return( N%2 )? A[ N/2 ] : ( A[ (N-1)/2 ] + A[ N/2 ] ) / 2;
}

double find_mean( HType A, size_t N ){
    if( ! A )
        return 0;
    int sum = 0;
    for( int i=0; i < N; sum += A[ i++ ] );
    return sum / N;
}

Type find_maximum( HType A, size_t N ){
    if( ! A )
        return 0;
    int max = -INF;
    for( int i=0; i < N; ++i )
        if( max < A[ i ] )
            max = A[ i ];
    return max;
}

Type find_minimum( HType A, size_t N ){
    if( ! A )
        return 0;
    int min = INF;
    for( int i=0; i < N; ++i )
        if( min > A[ i ] )
            min = A[ i ];
    return min;
}

int compare( const void* lhs, const void* rhs ){
    if( ! lhs || ! rhs )
        return 0;
    HType first  = ( HType ) lhs,
          second = ( HType ) rhs;
    Type a = *first,
         b = *second;
    return( a < b )? -1
        : ( a > b )?  1
        :             0;
}

void sort_array( HType A, size_t N, int ( * cmp )( const void*, const void* ) ){
    if( ! A )
        return;
    qsort( A, N, sizeof( Type ), cmp );
}
