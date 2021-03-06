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
 * @file stats.h
 * @brief header file for this assignment
 *
 * @author Clayton Wong
 * @date 2019-05-06
 *
 */
#ifndef __STATS_H__
#define __STATS_H__

typedef unsigned char Type;
typedef Type* HType;

/**
 * @brief A function that prints the statistics of an array including minimum, maximum, mean, and median.
 *
 * @param A - an array
 * @param N - the size of the array
 *
 * @return none
 */
void print_statistics( HType A, size_t N );

/**
 * @brief Given an array of data and a length, prints the array to the screen
 *
 * @param A - an array
 * @param N - the size of the array
 *
 * @return none
 */
void print_array( HType A, size_t N );

/**
 * @brief Given an array of data and a length, returns the median value
 *
 * @param A - an array
 * @param N - the size of the array
 *
 * @return the median value of the array
 */
Type find_median( HType A, size_t N );

/**
 * @brief Given an array of data and a length, returns the mean
 *
 * @param A - an array
 * @param N - the size of the array
 *
 * @return the mean value of the array
 */
Type find_mean( HType A, size_t N );

/**
 * @brief Given an array of data and a length, returns the maximum
 *
 * @param A - an array
 * @param N - the size of the array
 *
 * @return the maximum value of the array
 */
Type find_maximum( HType A, size_t N );

/**
 * @brief Given an array of data and a length, returns the minimum
 *
 * @param A - an array
 * @param N - the size of the array
 *
 * @return the minimum value of the array
 */
Type find_minimum( HType A, size_t N );

#endif /* __STATS_H__ */
