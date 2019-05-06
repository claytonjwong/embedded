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
    print_array( test, SIZE );
    print_statistics( test, SIZE );
    return 0;
}
