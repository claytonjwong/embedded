#include <stdio.h>
#include "stats.h"

/* Size of the Data Set */
#define SIZE ( 40 )

int main(){
    Type test[ SIZE ] = {  34, 201, 190, 154,   8, 194,   2,   6,
                          114,  88,  45,  76, 123,  87,  25,  23,
                          200, 122, 150,  90,  92,  87, 177, 244,
                          201,   6,  12,  60,   8,   2,   5,  67,
                            7,  87, 250, 230,  99,   3, 100,  90, };
    printf( "raw:    " );
    print_array( test, SIZE );
    print_statistics( test, SIZE );
    return 0;
}

/*
    raw:    34 201 190 154 8 194 2 6 114 88 45 76 123 87 25 23 200 122 150 90 92 87 177 244 201 6 12 60 8 2 5 67 7 87 250 230 99 3 100 90
    sorted: 2 2 3 5 6 6 7 8 8 12 23 25 34 45 60 67 76 87 87 87 88 90 90 92 99 100 114 122 123 150 154 177 190 194 200 201 201 230 244 250
    min:    2
    max:    250
    median: 87.0
    mean:   93.0
*/